import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { Evidence } from '../models/evidence.model';
import { HttpClient } from '@angular/common/http';
import { GhostService } from './ghost.service';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  private evidenceLoaded = false;
  private evidence: Evidence[] = [];
  private evidenceSubject = new Subject<Evidence[]>();
  public onEvidenceUpdated$ = this.evidenceSubject.asObservable();

  private includedEvidence: Evidence[] = [];
  private includedEvidenceSubject = new Subject<Evidence[]>();
  public onIncludedEvidenceUpdated$ = this.includedEvidenceSubject.asObservable();

  private excludedEvidence: Evidence[] = [];
  private excludedEvidenceSubject = new Subject<Evidence[]>();
  public onExcludedEvidenceUpdated$ = this.excludedEvidenceSubject.asObservable();

  private ghostIncludedEvidence: Evidence[] = [];
  private ghostIncludedEvidenceSubject = new Subject<Evidence[]>();
  public onGhostIncludedEvidenceUpdated$ = this.ghostIncludedEvidenceSubject.asObservable();

  private ghostExcludedEvidence: Evidence[] = [];
  private ghostExcludedEvidenceSubject = new Subject<Evidence[]>();
  public onGhostExcludedEvidenceUpdated$ = this.ghostExcludedEvidenceSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  getEvidence(): Observable<Evidence[]> {
    if (this.evidenceLoaded)
      return of(this.evidence);
    else
      return this.refreshEvidence();
  }

  refreshEvidence(): Observable<Evidence[]> {
    return this.httpClient.get<Evidence[]>('./assets/data/evidence.json').pipe(map(evidence => {
      this.evidence = evidence;
      this.evidenceSubject.next(this.evidence);
      this.evidenceLoaded = true;

      return this.evidence;
    }));
  }

  addIncludedEvidence(evidence: Evidence)
  {
    if (!this.includedEvidence.includes(evidence))
    {
      this.includedEvidence.push(evidence)
      this.includedEvidenceSubject.next(this.includedEvidence);
    }
  }

  removeIncludedEvidence(evidence: Evidence)
  {
    const index = this.includedEvidence.indexOf(evidence);
    if (index >= 0)
    {
      this.includedEvidence.splice(index);
      this.includedEvidenceSubject.next(this.includedEvidence);
    }
  }

  getEvidenceById(id: string): Evidence | null
  {
    const index = this.evidence.findIndex(evidence => evidence.id == id);
    if (index >= 0)
      return this.evidence[index];
    else
      return null;
  }

  removeGhostExcludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId);

      if (evidence)
      {
        const index = this.ghostExcludedEvidence.indexOf(evidence);
        this.ghostExcludedEvidence.splice(index, 1);
        this.ghostExcludedEvidenceSubject.next(this.ghostExcludedEvidence);
      } else {
        console.warn('tried to remove ghost excluded evidence by id:', evidenceId);
      }
    });
  }

  addGhostInlcudedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId)
      if (evidence)
      {
        if (!this.ghostIncludedEvidence.includes(evidence))
        {
          this.ghostIncludedEvidence.push(evidence);
          this.ghostExcludedEvidenceSubject.next(this.ghostIncludedEvidence);
        }
      }
      else
        console.warn('tried to add ghost included evidence by id:', evidenceId);
    })
  }

  clearGhostIncludedEvidence()
  {
    this.ghostIncludedEvidence = []
    this.ghostIncludedEvidenceSubject.next(this.ghostIncludedEvidence);
  }

  removeGhostIncludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      const evidence = this.getEvidenceById(evidenceId)
      if (evidence)
      {
        const index = this.includedEvidence.indexOf(evidence);
        if (index >= 0)
        {
          this.ghostIncludedEvidence.splice(index, 1)
          this.includedEvidenceSubject.next(this.ghostIncludedEvidence)
        }
      }
      else
      console.warn('tried to add ghost included evidence by id:', evidenceId);
    })
  }

  addGhostExcludedEvidences(evidences: string[])
  {
    evidences.forEach(evidenceId => {
      
      const evidence = this.getEvidenceById(evidenceId);

      if (evidence)
      {
        if(!this.ghostExcludedEvidence.includes(evidence))
        {
          this.ghostExcludedEvidence.push(evidence);
          this.ghostExcludedEvidenceSubject.next(this.ghostExcludedEvidence);
        }
      }
      else {
        console.warn('tried to add ghost excluded evidence by id:', evidenceId);
      }
    })
  }

  addExcludedEvidence(evidence: Evidence)
  {
    if (!this.excludedEvidence.includes(evidence))
    {
      this.excludedEvidence.push(evidence)
      this.excludedEvidenceSubject.next(this.excludedEvidence);
    }
  }

  removeExclusiveEvidence(evidence: Evidence)
  {
    const index = this.excludedEvidence.indexOf(evidence);
    if (index >= 0)
    {
      this.excludedEvidence.splice(index);
      this.excludedEvidenceSubject.next(this.excludedEvidence);
    }
  }

  isEvidenceGhostIncluded(evidence: Evidence): boolean
  {
    return this.ghostIncludedEvidence.includes(evidence);
  }

  isEvidenceDisproved(evidence: Evidence): boolean
  {
    return this.excludedEvidence.includes(evidence);
  }

  isEvidenceExcluded(evidence: Evidence): boolean
  {
    return this.ghostExcludedEvidence.includes(evidence);
  }
}
