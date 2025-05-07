import { useDeal } from '@/context/deal-context';
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
import {
  ArrowUpDown,
  MoreHorizontal,
  RefreshCcw,
  Search,
  X,
} from 'lucide-react';

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
import { Deal } from '@/types/Deal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import DetailDealModal from '@/components/modal/deal/detail';
import DeleteDealModal from '@/components/modal/deal/delete';
import {
  formatCpfCnpj,
  formatCurrency,
  formatDate,
  formatDealStatus,
  formatNumber,
  formatObject,
  formatPhone,
  formatStatusColor,
} from '@/utils/formats';
import { AxiosError } from 'axios';
import CreateDealModal from '@/components/modal/deal/create';
import { CopyButton } from '@/components/copy-button/copy-button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker/date-picker';
import { SelectInput } from '@/components/select-input/select-input';
import { useProfile } from '@/context/profile-context';
import { TooltipComponent } from '@/components/tooltip/tooltip';
import { useFunnel } from '@/context/funnel-context';
import { useParams } from 'react-router-dom';

export default function Deals() {
  const { onLoading, offLoading } = useLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Deal[]>([]);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [funnel, setFunnel] = useState({
    id: '',
    name: '',
    description: '',
  });
  const [filter, setFilter] = useState({
    label: 'cpf_cnpj',
    value: '',
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [profiles, setProfiles] = useState([]);

  const { funnelId } = useParams();

  const { getFunnel } = useFunnel();
  const { getProfiles } = useProfile();

  async function fetchProfiles() {
    try {
      const response = await getProfiles();
      console.log(response);
      if (response.status === 200) {
        setProfiles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchFunnel() {
    try {
      const response = await getFunnel(funnelId!);
      console.log(response);
      if (response.status === 200) {
        setFunnel(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProfiles();
    fetchFunnel();
  }, []);

  const { getDeals } = useDeal();

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
    fetchDeals();
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

  async function fetchDeals() {
    await onLoading();
    try {
      const params: Record<string, string> = {};

      if (filter.value) {
        params[filter.label] =
          filter.label === 'cpf_cnpj' || filter.label === 'phone'
            ? formatNumber(filter.value)
            : filter.value;
      }

      if (startDate && endDate) {
        params['created_at_start'] = startDate.toString();
        params['created_at_end'] = endDate.toString();
      }

      const response = await getDeals(params);
      setData(response.data);
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

  async function fetchDealsWithProfile(value: string) {
    await onLoading();
    try {
      const updatedFilter = {
        label: 'profile',
        value,
      };
      const params: Record<string, string> = {
        [updatedFilter.label]: updatedFilter.value,
      };
      const response = await getDeals(params);
      setData(response.data);
      setFilter(updatedFilter);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao buscar contatos com perfil');
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchDeals();
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

  const columns: ColumnDef<Deal>[] = [
    {
      accessorKey: 'contact_name',
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
      cell: ({ row }) => {
        const name: string = row.getValue('contact_name');
        return (
          <div className=" justify-between w-full flex items-center">
            {name} <CopyButton value={name} />
          </div>
        );
      },
    },
    {
      accessorKey: 'contact_cpf_cnpj',
      header: ({ column }) => {
        return (
          <div>
            CPF/CNPJ
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
        const cpf_cnpj: string = row.getValue('contact_cpf_cnpj');
        return (
          <div className=" justify-between w-full flex items-center">
            {formatCpfCnpj(cpf_cnpj)}{' '}
            <CopyButton value={formatCpfCnpj(cpf_cnpj)} />
          </div>
        );
      },
    },
    {
      accessorKey: 'contact_phone',
      header: ({ column }) => {
        return (
          <div>
            Telefone
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
        const phone: string = row.getValue('contact_phone');
        return (
          <div className=" justify-between w-full flex items-center">
            {formatPhone(phone)} <CopyButton value={phone} />
          </div>
        );
      },
    },

    {
      accessorKey: 'pipeline_name',
      header: ({ column }) => {
        return (
          <div>
            Pipeline
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
        const pipeline_name: string = row.getValue('pipeline_name');
        return (
          <div
          >
            {pipeline_name}
          </div>
        );
      },
    },
    {
      accessorKey: 'product_name',
      header: ({ column }) => {
        return (
          <div>
            Produto
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
        const product_name: string = row.getValue('product_name');
        return (
          <div
          >
            {product_name}
          </div>
        );
      },
    },
    {
      accessorKey: 'value',
      header: ({ column }) => {
        return (
          <div>
            Valor
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
        const value: string = row.getValue('value');
        return (
          <div
          >
            {formatCurrency(value)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <div>
            Status
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
      cell: ({ row }) => (
        <div className={`${formatStatusColor(row.getValue('status'))} text-center rounded-md text-white `}>
          {formatDealStatus(row.getValue('status'))}
        </div>
      ),
    },
    {
      accessorKey: 'user_name',
      header: ({ column }) => {
        return (
          <div>
            Usuário
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
        const user_name: string = row.getValue('user_name');
        return (
          <div
          >
            {user_name}
          </div>
        );
      },
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
                Visualizar cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDeleteModal(item.id!)}>
                Remover cliente
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

  const filterOptions = [
    {
      title: 'Filtros',
      items: [
        { label: 'CPF/CNPJ', value: 'cpf_cnpj' },
        { label: 'Nome', value: 'name' },
        { label: 'Telefone', value: 'phone' },
        { label: 'E-mail', value: 'email' },
        { label: 'Perfil', value: 'profile' },
        { label: 'Data de criação', value: 'created_at' },
      ],
    },
  ];

  async function changeFilter(value: string) {
    setFilter({ label: value, value: '' });
  }

  const filterName = filterOptions[0].items.find(
    (i) => i.value === filter.label,
  )?.label;

  function renderFilterInput() {
    switch (filter.label) {
      case 'created_at':
        return (
          <div className="relative flex gap-2 w-full min-w-[300px] items-center">
            <DatePicker date={startDate} setDate={setStartDate} />
            <DatePicker date={endDate} setDate={setEndDate} />
            <Button
              className=" top-0 right-0 p-3 h-9"
              variant="ghost"
              onClick={async () => {
                await fetchDeals();
              }}
              disabled={!startDate || !endDate}
            >
              <Search />
            </Button>
            {(startDate || endDate) && (
              <Button
                className=" top-0 right-12 p-1.5 h-9"
                type="button"
                variant="ghost"
                onClick={async () => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  await fetchDeals();
                }}
              >
                <X />
              </Button>
            )}
          </div>
        );
      case 'profile':
        return (
          <SelectInput
            placeholder="Selecione um perfil"
            options={[
              {
                title: 'Perfis',
                items: formatObject(profiles, 'name', 'id'),
              },
            ]}
            value={filter.value}
            onChange={async (e) => {
              await fetchDealsWithProfile(e);
            }}
          />
        );
      default:
        return (
          <>
            <Input
              className="w-full"
              type={filter.label === 'email' ? 'email' : 'text'}
              value={
                filter.label === 'cpf_cnpj'
                  ? formatCpfCnpj(filter.value)
                  : filter.label === 'phone'
                  ? formatPhone(filter.value)
                  : filter.value
              }
              onChange={(e) => setFilter({ ...filter, value: e.target.value })}
              placeholder={`Busque pelo ${filterName!.toLowerCase()}`}
            />
            <Button
              className="absolute top-0 right-0 p-3 h-9"
              variant="ghost"
              disabled={!filter.value}
            >
              <Search />
            </Button>
          </>
        );
    }
  }

  return (
    <>
      {createModal && (
        <CreateDealModal
          open={createModal}
          close={controlCreateModal}
          getData={fetchDeals}
        />
      )}
      {id && (
        <DetailDealModal
          id={id}
          open={detailModal}
          close={closeDetailModal}
          getData={fetchDeals}
        />
      )}
      {deleteId && (
        <DeleteDealModal
          id={deleteId}
          open={deleteModal}
          close={closeDeleteModal}
          getData={fetchDeals}
        />
      )}
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full flex items-center justify-between">
            <div className="flex w-full justify-between items-start">
              <h1 className="text-[1.5rem] font-medium m-0">{funnel.name}</h1>
              <form
                className="flex items-center gap-2 min-h-7w-[300px]"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetchDeals();
                }}
              >
                <div className="relative w-full min-w-[300px]">
                  {renderFilterInput()}
                  {filter.value && (
                    <Button
                      className="absolute top-0 right-10 p-1.5 h-9"
                      type="button"
                      variant="ghost"
                      onClick={async () => {
                        await fetchDealsWithProfile('');
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <div className="">
                  <SelectInput
                    options={filterOptions}
                    value={filter.label}
                    onChange={changeFilter}
                  />
                </div>
                <TooltipComponent
                  button={
                    <Button className="p-3 h-9" variant="outline">
                      <RefreshCcw />
                    </Button>
                  }
                  children={<span>Refresh</span>}
                />
              </form>
              <div className="flex items-center gap-2">
                <Button
                  variant={'outline'}
                  onClick={() => controlCreateModal()}
                >
                  Adicionar cliente
                </Button>
                <Button onClick={() => controlCreateModal()}>
                  Adicionar Oportunidade
                </Button>
              </div>
            </div>
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
