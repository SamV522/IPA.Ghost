import { Component } from '@angular/core';
import { Ghost } from '../../models/ghost.model';
import { Subject, takeUntil } from 'rxjs';
import { EvidenceService as EvidenceService } from '../../services/evidence.service';
import { Evidence } from '../../models/evidence.model';
import { GhostService } from '../../services/ghost.service';

@Component({
  selector: 'app-ghost-list',
  templateUrl: './ghost-list.component.html',
  styleUrls: ['./ghost-list.component.css'],
  host: { 'style': 'height: 100%;'}
})

export class GhostListComponent {
  unsubscribe = new Subject<void>();
  ghosts: Ghost[] = [];
  columns: any[] = [[], [], []]; // Initialize 3 columns
  selectedGhost?: Ghost;
  excludedGhosts: Ghost[] = [];

  provedEvidence: Evidence[] = [];
  disprovedEvidence: Evidence[] = []

  constructor(private ghostService: GhostService, private evidenceService: EvidenceService  ) {}

  ngOnInit() {
    this.ghostService.getGhosts().subscribe((data) => {
      // Sort ghosts alphabetically by name
      this.ghosts = data;
      
      // Calculate how many ghosts per column
      const ghostsPerColumn = Math.ceil(this.ghosts.length / 3);

      // Distribute ghosts into columns
      for (let i = 0; i < 3; i++) {
        this.columns[i] = this.ghosts.slice(i * ghostsPerColumn, (i + 1) * ghostsPerColumn);
      }
    });

    this.ghostService.onExcludedGhostsUpdated$.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(excluded => {
      this.excludedGhosts = excluded;
    })

    
    this.evidenceService.onIncludedEvidenceUpdated$.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(evidence => {
      this.provedEvidence = evidence;
    });

    this.evidenceService.onExcludedEvidenceUpdated$.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(evidence => {
      this.disprovedEvidence = evidence;
    });
  }

  ghostClicked(selected: Ghost)
  {
    // The ghost is already selected
    if (this.isGhostSelected(selected))
    {
      // Cross it off
      this.excludeGhost(selected);
      this.selectGhost(undefined);
    } else {
      // The ghost is already excluded
      const index = this.excludedGhosts.indexOf(selected)
      if (index >= 0)
      {
        // Remove the exclusion
        this.removeExcludedGhost(selected);
      } else {
        // Select the ghost
        this.selectGhost(selected);
      }
    }
  }

  isGhostSelected(ghost: Ghost): boolean {
    return this.ghostService.isSelectedGhost(ghost);
  }

  selectGhost(ghost: Ghost | undefined)
  {
    this.ghostService.selectGhost(ghost);
  }

  removeExcludedGhost(ghost: Ghost) {
    this.ghostService.removeExcludedGhost(ghost);
    this.evidenceService.removeGhostExcludedEvidences(ghost.evidence);
  }

  excludeGhost(ghost: Ghost) {
    this.ghostService.addExcludedGhosts(ghost);
  }

  undisproveGhost(ghost: Ghost)
  {
    this.ghostService.removeDisprovedGhost(ghost);
    this.evidenceService.removeGhostExcludedEvidences(ghost.evidence);
  }

  disproveGhost(ghost: Ghost)
  {
    this.ghostService.addDisprovedGhost(ghost);
    this.evidenceService.addGhostExcludedEvidences(ghost.evidence);
  }

  isGhostDisproved(ghost: Ghost): boolean {
    return this.ghostService.isGhostDisproved(ghost);
  }
  
  isGhostExcluded(ghost: Ghost): boolean {
    return this.ghostService.isGhostExcluded(ghost);

      // evidence has come up, that does not belong to ghost.
      const allEvidenceMatch = this.provedEvidence.every(proved => ghost.evidence && ghost.evidence.includes(proved.id));

      const anyEvidenceDisproved = this.disprovedEvidence.some(disproved => ghost.evidence.includes(disproved.id));

      return !allEvidenceMatch || anyEvidenceDisproved;

      // any ghosts not in this filter will be excluded

      // a ghost can have evidence that immediately exclude it. e.g. "Paramic Banshee Scream", Only the Banshee does Baneshee Scream.
      // if turned on, the majority will be excluded, and only Mare will show.
      // if turned off, the majority won't move, but Mare will be excluded.

      // a ghost can have evidence that immediately exclude it. e.g. "Can Turn Lights On", Mare Cannot Turn Lights On.
      // if turned on, the majority won't move, but Mare will be excluded
      // if turned off, the majority will be excluded, and only Mare will show.

      // a ghost can have evidence that immediately include it. e.g. "Firelight Hunt", Only the Onryo will Firelight Hunt.
      // if turned on, the majority will be excluded, and only Onryo will show.
      // if turned off, the majority will show, but Onryo will be excluded.

      // there are 3 states to evidence
      // unknown eg: ghost has not hunted - firelight hunt
      // proved: ghost hunted after firelight blown out - firelight hunt
      // disproved: ghost did not hunt after firelight blown out - firelight hunt

      /*
        Case Study:
          Ghost: Banshee
          Can Turn Lights On: Proved -- ONLY Mare excluded
          Banshee Scream: Proved -- ONLY Banshee included

          As a Banshee, how am I excluded?
            Can Turn Lights On: Proved - does not disprove my evidence.
            Banshee Scream: Proved - proves my evidence


          As a Hantu, how am I excluded?
            Can Turn Lights On: Proved - does not disprove my evidence
            Banshee Scream: Proved - disproves my evidence
          
          Inclusive Evidence:
            A fact, or statement, if proven, includes the ghost(s) it belongs to, others are excluded.

            e.g. Firelight Hunt - is Inclusion Evidence of Onryo

          Exclusive evidence:
            A fact, or statement, if proven, excludes the ghost(s) it belongs to.

            e.g. Can Turn Lights On - is Exclusion Evidence of Mare.
      */
  }
}
