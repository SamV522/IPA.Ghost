import { Component, Input } from '@angular/core';
import { EvidenceService } from '../../services/evidence.service';
import { Evidence } from '../../models/evidence.model';
import { Observable } from 'rxjs';
import { GhostService } from 'src/app/services/ghost.service';

@Component({
  selector: 'app-evidence-list',
  templateUrl: './evidence-list.component.html',
  styleUrls: ['./evidence-list.component.css']
})
export class EvidenceListComponent {

  @Input() evidence!: Observable<Evidence[]>;
  @Input() alphabeticalSort: boolean = false;
  @Input() columns: number = 2
  @Input() categorize: boolean = false;

  evidenceList: Evidence[] = [];

  constructor(private evidenceService: EvidenceService, private ghostService: GhostService  ) {}

  ngOnInit() {
    this.evidence.subscribe((data) => {
      // Sort evidence alphabetically by name
      if(this.alphabeticalSort)
        this.evidenceList = data.sort((a, b) => a.name.localeCompare(b.name));
      else
        this.evidenceList = data;

    });
  }

  splitEvidenceIntoColumns(evidence: Evidence[]): Evidence[][] {
    let columns: Evidence[][] = [[], []]

    // Calculate how many evidence per column
    const evidencePerColumn = Math.ceil(evidence.length / columns.length);
    
    // Distribute evidence into columns
    for (let i = 0; i < this.columns; i++) {
      columns[i] = evidence.slice(i * evidencePerColumn, (i + 1) * evidencePerColumn);
    }

    return columns;
  }

  isEvidenceGhostIncluded(evidence: Evidence): boolean
  {
    return this.evidenceService.isEvidenceGhostIncluded(evidence);
  }

  isEvidenceGhostExcluded(evidence: Evidence): boolean
  {
    return this.evidenceService.isEvidenceGhostExcluded(evidence);
  }

  isEvidenceIncluded(evidence: Evidence): boolean {
    return this.evidenceService.isEvidenceIncluded(evidence);
  }

  isEvidenceDisproved(evidence: Evidence)
  {
    return this.evidenceService.isEvidenceDisproved(evidence);
  }

  isEvidenceExcluded(evidence: Evidence)
  {
    return this.evidenceService.isEvidenceDisproved(evidence) || this.evidenceService.isEvidenceGhostExcluded(evidence);
  }

  isEvidenceInCommon(evidence: Evidence)
  {
    return this.ghostService.getEvidenceInCommon().includes(evidence.id)
  }

  evidenceClicked(evidence: Evidence)
  {
    if(this.isEvidenceGhostExcluded(evidence) && !this.isEvidenceExcluded(evidence))
      return;
    
    if (this.isEvidenceIncluded(evidence))
    {
      // remove from included
      this.evidenceService.removeIncludedEvidence(evidence);
      // add to excluded
      this.evidenceService.addExcludedEvidence(evidence);
    } else {
      if (this.isEvidenceExcluded(evidence))
      {
        // remove from excluded
        this.evidenceService.removeExcludedEvidence(evidence);
      } else {
        // add to included
        this.evidenceService.addIncludedEvidence(evidence);
      }
    }
  }
}
