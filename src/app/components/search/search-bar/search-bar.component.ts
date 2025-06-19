import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  onSearchTermChange() {
    this.searchEvent.emit(this.searchTerm);
  }

  buscar() {
    this.searchEvent.emit(this.searchTerm);
  }
}
