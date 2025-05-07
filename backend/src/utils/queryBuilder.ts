import { Between, ILike } from 'typeorm';

export default function queryBuilder(query: any) {
  const { skip, take, ...filters } = query;
  const where: any = {};

  const start = filters['created_at_start'];
  const end = filters['created_at_end'];

  for (const key in filters) {
    if (!filters[key]) continue;

    if (key === 'created_at_start' || key === 'created_at_end') {
      if (start && end) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        where['created_at'] = Between(startDate, endDate);
      }
      continue;
    }

    if (key === 'profile') {
      where[key] = filters[key];
    } else if (['cpf_cnpj', 'phone'].includes(key)) {
      where[key] = filters[key];
    } else {
      where[key] = ILike(`%${filters[key]}%`);
    }
  }

  return { where };
}