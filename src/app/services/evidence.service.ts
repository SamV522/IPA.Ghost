import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, map, of } from 'rxjs';
import { Evidence } from '../models/evidence.model';
import { HttpClient } from '@angular/common/http';
import { EvidenceCategory } from '../models/evidence-category.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  private evidenceLoaded = false;

  private _categories: EvidenceCategory[] = [];
  private _evidence: Evidence[] = [];
  private evidenceSubject = new Subject<Evidence[]>();
  public onEvidenceUpdated$ = this.evidenceSubject.asObservable();

  private _includedEvidence: Evidence[] = [];
  private includedEvidenceSubject = new Subject<Evidence[]>();
  public onIncludedEvidenceUpdated$ = this.includedEvidenceSubject.asObservable();

  private _excludedEvidence: Evidence[] = [];
  private excludedEvidenceSubject = new Subject<Evidence[]>();
  public onExcludedEvidenceUpdated$ = this.excludedEvidenceSubject.asObservable();

  private _ghostIncludedEvidence: Evidence[] = [];
  private ghostIncludedEvidenceSubject = new Subject<Evidence[]>();
  public onGhostIncludedEvidenceUpdated$ = this.ghostIncludedEvidenceSubject.asObservable();

  private _ghostExcludedEvidence: Evidence[] = [];
  private ghostExcludedEvidenceSubject = new Subject<Evidence[]>();
  public onGhostExcludedEvidenceUpdated$ = this.ghostExcludedEvidenceSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  get evidence() { 
    return { 
      included: this._includedEvidence, 
      excluded: this._excludedEvidence,
      ghostIncluded: this._ghostIncludedEvidence,
      ghostExcluded: this._ghostExcludedEvidence
    }
  }
  get includedEvidence() { return this._includedEvidence; }
  get excludedEvidence() { return this._excludedEvidence; }
  get ghostIncludedEvidence() { return this._ghostIncludedEvidence; }
  get ghostExcludedEvidence() { return this._ghostExcludedEvidence; }

  getEvidence(): Observable<Evidence[]> {
    if(this.evidenceLoaded)
      return of(this._evidence);
    else
      return this.refreshEvidence();
  }

  getPrimaryEvidence(): Observable<Evidence[]> {
    if (this.evidenceLoaded)
      return of(this._evidence.filter(evidence => evidence.primary));
    else
      return this.refreshEvidence().pipe(map(evidence => evidence.filter(e => e.primary)));
  }

  getSecondaryEvidence(): Observable<Evidence[]> {
    if (this.evidenceLoaded)
      return of(this._evidence.filter(evidence => !evidence.primary));
    else {
      return this.refreshEvidence().pipe(map(evidence => evidence.filter(e => !e.primary)));
    }
  }

  clearAllEvidence() {
    this.clearIncludedEvidence();
    this.clearExcludedEvidence();
    this.clearGhostIncludedEvidence();
    this.clearGhostExcludedEvidences();
  }

  refreshEvidence(): Observable<Evidence[]> {
    return forkJoin([
      this.httpClient.get<Evidence[]>('./assets/data/evidence.json'),
      this.httpClient.get<EvidenceCategory[]>('./assets/data/evidence-categories.json')
    ]).pipe(
      map(([evidenceData, categoriesData]) => {
        this._evidence = evidenceData;
        this._categories = categoriesData;
        return evidenceData;
      })
    );
  }

  getEvidenceByCategoryKey(key: string): Evidence[] {
    const categoryEvidence = this._evidence.filter(evidence => evidence.categories.includes(key))
    return categoryEvidence;
  }

  addIncludedEvidence(evidence: Evidence)
  {
    if (!this._includedEvidence.some(ev => ev.id == evidence.id))
    {
      this._includedEvidence.push(evidence)
      this.includedEvidenceSubject.next(this._includedEvidence);
    }
  }

  removeIncludedEvidence(evidence: Evidence)
  {
    const index = this._includedEvidence.indexOf(evidence);
    if (index >= 0)
    {
      this._includedEvidence.splice(index);
      this.includedEvidenceSubject.next(this._includedEvidence);
    }
  }

  clearIncludedEvidence() {
    this._includedEvidence = [];
    this.includedEvidenceSubject.next(this._includedEvidence);
  }

  getEvidenceById(id: string): Evidence | null
  {
    const index = this._evidence.findIndex(evidence => evidence.id == id);
    if (index >= 0)
      return this._evidence[index];
    else
      return null;
  }

  addGhostInlcudedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId)
      if (evidence)
      {
        if (!this._ghostIncludedEvidence.some(ev => ev.id == evidence.id))
        {
          this._ghostIncludedEvidence.push(evidence);
          this.ghostExcludedEvidenceSubject.next(this._ghostIncludedEvidence);
        }
      }
      else
        console.warn('tried to add ghost included evidence by id:', evidenceId);
    })
  }

  removeGhostIncludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId)
      if (evidence)
      {
        const index = this._includedEvidence.indexOf(evidence);
        if (index >= 0)
        {
          this._ghostIncludedEvidence.splice(index, 1)
          this.includedEvidenceSubject.next(this._ghostIncludedEvidence)
        }
      }
      else
      console.warn('tried to add ghost included evidence by id:', evidenceId);
    })
  }

  clearGhostIncludedEvidence()
  {
    this._ghostIncludedEvidence = []
    this.ghostIncludedEvidenceSubject.next(this._ghostIncludedEvidence);
  }

  addGhostExcludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      
      const evidence = this.getEvidenceById(evidenceId);

      if (evidence)
      {
        if(evidence.id =='emf')
        {
          console.log('should be excluding emf');
        }

        if(!this._ghostExcludedEvidence.some(ev => ev.id == evidence.id))
        {
          this._ghostExcludedEvidence.push(evidence);
          this.ghostExcludedEvidenceSubject.next(this._ghostExcludedEvidence);
        }
      }
      else {
        console.warn('tried to add ghost excluded evidence by id:', evidenceId);
      }
    })
  }

  removeGhostExcludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId);
      if (evidence)
      {
        const index = this._ghostExcludedEvidence.indexOf(evidence);
        if (index >= 0)
        {
          this._ghostExcludedEvidence.splice(index, 1);
          this.ghostExcludedEvidenceSubject.next(this._ghostExcludedEvidence);
        }
      } else {
        console.warn('tried to remove ghost excluded evidence by id:', evidenceId);
      }
    });
  }

  clearGhostExcludedEvidences()
  {
    this._ghostExcludedEvidence = [];
    this.ghostExcludedEvidenceSubject.next(this._ghostExcludedEvidence);
  }

  addExcludedEvidence(evidence: Evidence)
  {
    if (!this._excludedEvidence.some(ev => ev.id == evidence.id))
    {
      this._excludedEvidence.push(evidence)
      this.excludedEvidenceSubject.next(this._excludedEvidence);
    }
  }

  removeExcludedEvidence(evidence: Evidence)
  {
    const index = this._excludedEvidence.indexOf(evidence);
    if (index >= 0)
    {
      this._excludedEvidence.splice(index, 1);
      this.excludedEvidenceSubject.next(this._excludedEvidence);
    }
  }

  clearExcludedEvidence() {
    this._excludedEvidence = [];
    this.excludedEvidenceSubject.next(this._excludedEvidence);
  }

  isEvidenceGhostIncluded(evidence: Evidence): boolean
  {
    return this._ghostIncludedEvidence.some(ev => ev.id == evidence.id);
  }

  isEvidenceGhostExcluded(evidence: Evidence): boolean
  {
    return this._ghostExcludedEvidence.some(ev => ev.id == evidence.id);
  }

  isEvidenceIncluded(evidence: Evidence): boolean
  {
    return this._includedEvidence.some(ev => ev.id == evidence.id);
  }

  isEvidenceDisproved(evidence: Evidence): boolean
  {
    return this._excludedEvidence.some(ev => ev.id == evidence.id);
  }

  isEvidenceExcluded(evidence: Evidence): boolean
  {
    return this._ghostExcludedEvidence.some(ev => ev.id == evidence.id);
  }
}
