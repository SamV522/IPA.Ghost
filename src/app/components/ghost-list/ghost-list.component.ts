import { Component } from '@angular/core';
import { Ghost } from '../../models/ghost.model';
import { Subject, takeUntil } from 'rxjs';
import { EvidenceService as EvidenceService } from '../../services/evidence.service';
import { Evidence } from '../../models/evidence.model';
import { GhostService } from '../../services/ghost.service';

@Component({
  selector: 'app-ghost-list',
  templateUrl: './ghost-list.component.html',
  styleUrls: ['./ghost-list.component.css']
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
  }

  ghostClicked(selected: Ghost)
  {
    // The ghost is already selected
    if (this.ghostService.isSelectedGhost(selected))
    {
      // Cross it off
      this.ghostService.addExcludedGhosts(selected);
      this.ghostService.selectGhost(undefined);
    } else {
      // The ghost is already excluded
      if(this.ghostService.isGhostExcluded(selected))
        this.ghostService.removeExcludedGhost(selected);
      else
        this.ghostService.selectGhost(selected)
    }
  }

  isGhostSelected(ghost: Ghost): boolean {
    return this.ghostService.isSelectedGhost(ghost);
  }

  resetEvidence() {
    this.ghostService.clearAllGhosts();
    this.evidenceService.clearAllEvidence();
  }

  isGhostDisproved(ghost: Ghost): boolean {
    return this.ghostService.isGhostDisproved(ghost);
  }
  
  isGhostExcluded(ghost: Ghost): boolean {
    return this.ghostService.isGhostExcluded(ghost);
  }
}
