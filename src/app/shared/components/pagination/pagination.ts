import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagedResultDTO } from '../../dtos/paged-result.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() paged!: PagedResultDTO<any>; // Info de paginado
  @Input() range: number = 5; // Rango de páginas a mostrar
  @Output() pageChange = new EventEmitter<number>(); // Evento al cambiar página

  // Genera array de páginas
  getPages(): number[] {
    const start = Math.max(this.paged.page - this.range, 1);
    const end = Math.min(this.paged.page + this.range, this.paged.totalPages);

    const pages: number[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Asegurar que siempre incluyamos la primera y última página
    pages[0] = 1;
    pages[pages.length - 1] = this.paged.totalPages;

    return pages;
  }

  changePage(page: number) {
    if (page < 1 || page > this.paged.totalPages || page === this.paged.page) return;
    this.pageChange.emit(page);
  }
}
