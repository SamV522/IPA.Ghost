import { Injectable } from '@angular/core';
import { EvidenceService } from './evidence.service';
import { Ghost } from '../models/ghost.model';
import { Evidence } from '../models/evidence.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, combineLatest, concat, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GhostService {

  private ghostsLoaded = false;
  private ghosts: Ghost[] = [];
  private ghostsSubject = new Subject<Ghost[]>
  public onGhostsUpdated$ = this.ghostsSubject.asObservable();

  private selectedGhost: Ghost | undefined;
  private selectedGhostSubject = new Subject<Ghost | undefined>
  public onSelectedGhostUpdated$ = this.selectedGhostSubject.asObservable();

  private excludedGhosts: Ghost[] = [];
  private excludedGhostsSubject = new Subject<Ghost[]>
  public onExcludedGhostsUpdated$ = this.excludedGhostsSubject.asObservable();

  private disprovedGhosts: Ghost[] = [];
  private disprovedGhostsSubject = new Subject<Ghost[]>
  public onDisprovedGhostsUpdated$ = this.disprovedGhostsSubject.asObservable();


  constructor(private httpClient: HttpClient, private evidenceService: EvidenceService) 
  {     
    combineLatest([this.evidenceService.onExcludedEvidenceUpdated$, this.evidenceService.onIncludedEvidenceUpdated$]).subscribe(combined => {
      this.ghosts.forEach( ghost => this.removeDisprovedGhost(ghost));

      const excluded = combined[0];
      const included = combined[1];

      // Disproved if any evidence excluded
      this.ghosts
        .filter( ghost => !this.disprovedGhosts.includes(ghost)) // Ghosts that haven't been excluded yet
        .filter( ghost => excluded.some(evidence => ghost.evidence.includes(evidence.id))) // That have any excluded evidence
        .forEach( ghost => this.addDisprovedGhost(ghost));

      // Disprove any that don't have ALL included evidence  
      this.ghosts
        .filter( ghost => !this.disprovedGhosts.includes(ghost)) // Ghosts that haven't been excluded yet
        .filter( ghost => !included.every(evidence => ghost.evidence.includes(evidence.id))) // That don't have ALL the included evidence
        .forEach( ghost => this.addDisprovedGhost(ghost));
    })
  }

  isSelectedGhost(ghost: Ghost) {
    return this.selectedGhost == ghost;
  }

  selectGhost(ghost: Ghost | undefined) {
    this.selectedGhost = ghost;
    this.selectedGhostSubject.next(this.selectedGhost);

    this.evidenceService.clearGhostIncludedEvidence();

    if (ghost)
      this.evidenceService.addGhostInlcudedEvidences(ghost.evidence);
  }

  getGhosts(): Observable<Ghost[]> {
    if (this.ghostsLoaded)
      return of(this.ghosts);
    else
      return this.refreshGhosts();
  }

  refreshGhosts() {
    return this.httpClient.get<Ghost[]>('/assets/data/ghosts.json').pipe(map(ghosts => {
      this.ghosts = ghosts;
      this.ghostsSubject.next(this.ghosts);
      this.ghostsLoaded = true;
      
      return this.ghosts;
    }))
  }

  getExcludedGhostEvidence(excluded: Ghost[] = this.excludedGhosts, targetGhosts: Ghost[] = this.ghosts): string[] {
    let ghostEvidence = new Set<string>();
    
    targetGhosts.forEach((ghost) => {
      if (!excluded.includes(ghost))
      {
        ghost.evidence.forEach((evidenceId) => {
          ghostEvidence.add(evidenceId);
        })
      }
    });

    const includedGhostEvidence: string[] = Array.from(ghostEvidence);

    return excluded.flatMap(ghost => { return ghost.evidence; }).filter(evidence => !includedGhostEvidence.includes(evidence));
  }

  isGhostDisproved(ghost: Ghost){
    return this.disprovedGhosts.includes(ghost);
  }

  isGhostExcluded(ghost: Ghost){
    return this.excludedGhosts.includes(ghost);
  }
  
  addDisprovedGhost(disproved: Ghost) {
    if(!this.disprovedGhosts.includes(disproved))
    {
      this.disprovedGhosts.push(disproved);
      this.disprovedGhostsSubject.next(this.disprovedGhosts);
      this.evidenceService.addGhostExcludedEvidences(this.getExcludedGhostEvidence(this.disprovedGhosts))
    }
  }

  removeDisprovedGhost(disproved: Ghost) {
    const index = this.disprovedGhosts.indexOf(disproved);

    if(index >= 0)
    {
      this.disprovedGhosts.splice(index, 1);
      this.disprovedGhostsSubject.next(this.disprovedGhosts);
      this.evidenceService.removeGhostExcludedEvidences(disproved.evidence);
    }
  }

  addExcludedGhosts(excluded: Ghost){
    if (!this.excludedGhosts.includes(excluded))
    {
      this.excludedGhosts.push(excluded);
      this.excludedGhostsSubject.next(this.excludedGhosts);
      this.evidenceService.addGhostExcludedEvidences(this.getExcludedGhostEvidence())
    }
  }

  removeExcludedGhost(excluded: Ghost) {
    const index = this.excludedGhosts.indexOf(excluded);
    if (index >= 0)
    {
      this.excludedGhosts.splice(index, 1);
      this.excludedGhostsSubject.next(this.excludedGhosts);
      this.evidenceService.removeGhostExcludedEvidences(excluded.evidence);
    }
  }
}
