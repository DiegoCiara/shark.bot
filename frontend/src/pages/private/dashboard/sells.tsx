import { useEffect, useState } from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { chartBarData, chartData } from '@/utils/mock';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const chartBarConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

export default function Overview() {
  // const { onLoading, offLoading } = useLoading();
  // const [data, setData] = useState<Dashboard>({
  //   name: '',
  // });
  // const { getDashboard } = useDashboard();

  // async function fetchDashoard() {
  //   await onLoading();
  //   try {
  //     const { data } = await getDashboard();
  //     setData(data);
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       console.error(error);
  //       return toast.error(
  //         error.response?.data?.message || 'Algo deu errado, tente novamente.',
  //       );
  //     }
  //   } finally {
  //     await offLoading();
  //   }
  // }

  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // async function upDashboard(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   await onLoading()
  //   try {
  //     const response = await updateDashboard(data);
  //     if(response.status === 204){
  //       toast.success('Dashboard atualizado com sucesso')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     await offLoading()
  //   }
  // }

  useEffect(() => {
    // fetchDashoard();
  }, []);

  return (
    <>
      <div className="@container/main flex flex-1 gap-4 px-10">
        <div className="flex flex-col items-center md:gap-4 md:py-6 w-full">
          <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-4 grid grid-cols-4 w-full gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card ">
            <Card className="@container/card cursor-pointer hover:border-blue-500">
              <CardHeader className="relative">
                <CardDescription> Em andamento</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  R$1.000.250,00
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card cursor-pointer hover:border-yellow-500">
              <CardHeader className="relative">
                <CardDescription>Pendente</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  R$1.000.250,00
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card cursor-pointer hover:border-green-500">
              <CardHeader className="relative">
                <CardDescription>Pagos</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  R$1.000.250,00
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card cursor-pointer hover:border-red-500">
              <CardHeader className="relative">
                <CardDescription>Cancelados</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  R$1.000.250,00
                </CardTitle>
              </CardHeader>
            </Card>{' '}
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Ticket Médio</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  R$10.250,00
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                  >
                    <TrendingDownIcon className="size-3" />
                    -20%
                  </Badge>
                </div>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Growth Rate</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold tabular-nums">
                  4.5%
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                  >
                    <TrendingUpIcon className="size-3" />
                    +4.5%
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <div className="@container/main flex flex-1 gap-4 px-10">
        <div className=" w-full">
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardTitle>Vendas por período</CardTitle>
              <CardDescription>
                <span className="@[540px]/card:block hidden">
                  Total for the last 3 months
                </span>
                <span className="@[540px]/card:hidden">Last 3 months</span>
              </CardDescription>
              <div className="absolute right-4 top-4">
                <ToggleGroup
                  type="single"
                  value={timeRange}
                  onValueChange={setTimeRange}
                  variant="outline"
                  className="@[767px]/card:flex hidden"
                >
                  <ToggleGroupItem value="90d" className="h-8 px-2.5">
                    Last 3 months
                  </ToggleGroupItem>
                  <ToggleGroupItem value="30d" className="h-8 px-2.5">
                    Last 30 days
                  </ToggleGroupItem>
                  <ToggleGroupItem value="7d" className="h-8 px-2.5">
                    Last 7 days
                  </ToggleGroupItem>
                </ToggleGroup>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                    className="@[767px]/card:hidden flex w-40"
                    aria-label="Select a value"
                  >
                    <SelectValue placeholder="Last 3 months" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="90d" className="rounded-lg">
                      Last 3 months
                    </SelectItem>
                    <SelectItem value="30d" className="rounded-lg">
                      Last 30 days
                    </SelectItem>
                    <SelectItem value="7d" className="rounded-lg">
                      Last 7 days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 pb-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={chartBarConfig}
                className="h-[180px] w-full"
              >
                <BarChart accessibilityLayer data={chartBarData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('pt-BR', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString('pt-BR', {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:gap-4 w-full">
          <div className=" flex gap-4 w-full">
            <Card className="@container/card w-full">
              <CardHeader className="relative">
                <CardTitle>Contatos (40)</CardTitle>
                <CardDescription>
                  <span className="@[540px]/card:block hidden">
                    Total for the last 3 months
                  </span>
                  <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <div className="absolute right-4 top-4">
                  <ToggleGroup
                    type="single"
                    value={timeRange}
                    onValueChange={setTimeRange}
                    variant="outline"
                    className="@[767px]/card:flex hidden"
                  >
                    <ToggleGroupItem value="90d" className="h-8 px-2.5">
                      Last 3 months
                    </ToggleGroupItem>
                    <ToggleGroupItem value="30d" className="h-8 px-2.5">
                      Last 30 days
                    </ToggleGroupItem>
                    <ToggleGroupItem value="7d" className="h-8 px-2.5">
                      Last 7 days
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                      className="@[767px]/card:hidden flex w-40"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="px-2 pt-4 pb-4 sm:px-6 sm:pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[180px] w-full"
                >
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={1.0}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillMobile"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString('pt-BR', {
                              month: 'short',
                              day: 'numeric',
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="url(#fillMobile)"
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="url(#fillDesktop)"
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="@container/card w-full">
              <CardHeader className="relative">
                <CardTitle>Produtos</CardTitle>
                <CardDescription>
                  <span className="@[540px]/card:block hidden">
                    Total for the last 3 months
                  </span>
                  <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <div className="absolute right-4 top-4">
                  <ToggleGroup
                    type="single"
                    value={timeRange}
                    onValueChange={setTimeRange}
                    variant="outline"
                    className="@[767px]/card:flex hidden"
                  >
                    <ToggleGroupItem value="90d" className="h-8 px-2.5">
                      Last 3 months
                    </ToggleGroupItem>
                    <ToggleGroupItem value="30d" className="h-8 px-2.5">
                      Last 30 days
                    </ToggleGroupItem>
                    <ToggleGroupItem value="7d" className="h-8 px-2.5">
                      Last 7 days
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                      className="@[767px]/card:hidden flex w-40"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="px-2 pt-4 pb-4 sm:px-6 sm:pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[180px] w-full"
                >
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={1.0}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillMobile"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString('pt-BR', {
                              month: 'short',
                              day: 'numeric',
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="url(#fillMobile)"
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="url(#fillDesktop)"
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
