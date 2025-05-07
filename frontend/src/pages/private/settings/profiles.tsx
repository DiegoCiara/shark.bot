import { useProfile } from '@/context/profile-context';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Profile } from '@/types/Profile';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import DetailProfileModal from '@/components/modal/profile/detail';
import DeleteProfileModal from '@/components/modal/profile/delete';
import { formatDate } from '@/utils/formats';
import { AxiosError } from 'axios';
import CreateProfileModal from '@/components/modal/profile/create';

export default function Profiles() {
  const { onLoading, offLoading } = useLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Profile[]>([]);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { getProfiles } = useProfile();

  function controlCreateModal() {
    setCreateModal(!createModal);
  }

  function openDetailModal(id: string) {
    if (id) {
      setId(id);
      setDetailModal(!detailModal);
    }
  }
  function closeDetailModal() {
    setId('');
    setDetailModal(!detailModal);
  }

  function openDeleteModal(id: string) {
    if (id) {
      setDeleteId(id);
      setDeleteModal(!deleteModal);
    }
  }
  function closeDeleteModal() {
    setDeleteId('');
    setDeleteModal(!deleteModal);
  }

  async function fetchProfiles() {
    await onLoading();
    try {
      const { data } = await getProfiles();
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    const calculatePageSize = () => {
      const availableHeight = window.innerHeight - 400;
      const rowHeight = 40;
      const itemsPerPage = Math.max(5, Math.floor(availableHeight / rowHeight));
      setPageSize(itemsPerPage);
    };
    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);
    return () => {
      window.removeEventListener('resize', calculatePageSize);
    };
  }, []);

  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <div>
            Nome
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <div>
            Data de criação
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const created_at = row.original.created_at!;
        return <div>{formatDate(created_at.toString())}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDetailModal(item.id!)}>
                Visualizar Declaração
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDeleteModal(item.id!)}>
                Remover Declaração
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <>
      {createModal && (
        <CreateProfileModal
          open={createModal}
          close={controlCreateModal}
          getData={fetchProfiles}
        />
      )}
      {id && (
        <DetailProfileModal
          id={id}
          open={detailModal}
          close={closeDetailModal}
          getData={fetchProfiles}
        />
      )}
      {deleteId && (
        <DeleteProfileModal
          id={deleteId}
          open={deleteModal}
          close={closeDeleteModal}
          getData={fetchProfiles}
        />
      )}
      <main>
        <section className="flex flex-col gap-5 items-start justify-start py-2.5">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1.5rem] font-medium m-0">Perfis</h1>
            <Button onClick={() => controlCreateModal()}>
              Adicionar perfil
            </Button>
          </div>
          <div className="w-full">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="min-w-[170px] sm:min-w-[30px]"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="min-w-[170px] sm:min-w-[30px]"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-12 text-start sm:text-center"
                      >
                        Sem resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-[10px] text-muted-foreground">
                A quantidade de itens da tabela são renderizados de acordo com o
                tamanho de sua tela.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.previousPage();
                    setPageIndex(table.getState().pagination.pageIndex - 1);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.nextPage();
                    setPageIndex(table.getState().pagination.pageIndex + 1);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
