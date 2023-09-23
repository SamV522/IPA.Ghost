import { Component } from '@angular/core';
import { Evidence } from 'src/app/models/evidence.model';
import { EvidenceService } from 'src/app/services/evidence.service';

@Component({
  selector: 'app-primary-evidence-list',
  templateUrl: './primary-evidence-list.component.html',
  styleUrls: ['./primary-evidence-list.component.css']
})
export class PrimaryEvidenceListComponent {
  evidenceList: any[] = [];
  columns: any[] = [[], []];

  includedEvidence: Evidence[] = [];
  excludedEvidence: Evidence[] = [];

  constructor(private evidenceService: EvidenceService  ) {}

  ngOnInit() {
    this.evidenceService.getPrimaryEvidence().subscribe((data: Evidence[]) => {
      // Sort evidence alphabetically by name
      this.evidenceList = data;

      // Calculate how many evidence per column
      const evidencePerColumn = Math.ceil(this.evidenceList.length / this.columns.length);
      
      // Distribute evidence into columns
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i] = this.evidenceList.slice(i * evidencePerColumn, (i + 1) * evidencePerColumn);
      }
    });
  }

  isEvidenceGhostIncluded(evidence: Evidence): boolean
  {
    return this.evidenceService.isEvidenceGhostIncluded(evidence);
  }

  isEvidenceDisproved(evidence: Evidence)
  {
    return this.evidenceService.isEvidenceDisproved(evidence)
  }

  isEvidenceIncluded(evidence: Evidence): boolean
  {
    return this.evidenceService.isEvidenceIncluded(evidence);
  }

  isEvidenceExcluded(evidence: Evidence)
  {
    return this.evidenceService.isEvidenceExcluded(evidence)
  }

  evidenceClicked(evidence: Evidence)
  {
    const includedIndex = this.includedEvidence.indexOf(evidence);
    const excludedIndex = this.excludedEvidence.indexOf(evidence);

    if (this.includedEvidence.includes(evidence))
    {
      // remove from included
      this.includedEvidence.splice(includedIndex, 1);
      this.evidenceService.removeIncludedEvidence(evidence);
      // add to excluded
      this.excludedEvidence.push(evidence);
      this.evidenceService.addExcludedEvidence(evidence);
    } else {
      if (this.excludedEvidence.includes(evidence))
      {
        // remove from excluded
        this.excludedEvidence.splice(excludedIndex, 1);
        this.evidenceService.removeExcludedEvidence(evidence);
      } else {
        // add to included
        this.includedEvidence.push(evidence);
        this.evidenceService.addIncludedEvidence(evidence);
      }
    }
  }
}
