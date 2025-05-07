const users = [
  {
    name: 'Diego Ciara',
    email: 'diegociara.dev@gmail.com',
    role: 'ADMIN',
    password: 'password',
  },
  {
    name: 'Norean Ducker',
    email: 'nducker0@over-blog.com',
    password: 'tO8@inIy',
  },
  {
    name: 'Junie Hurley',
    email: 'jhurley1@studiopress.com',
    password: 'pW11kivNBl_\\',
  },
  {
    name: 'Jabez Fennelow',
    email: 'jfennelow2@github.io',
    password: 'bS0WG#}=j#RW',
  },
  {
    name: 'Johna Revance',
    email: 'jrevance3@ustream.tv',
    password: 'uX4#e&6"ZFW',
  },
  {
    name: 'Hanni Beagrie',
    email: 'hbeagrie4@networksolutions.com',
    password: 'iX4G6M&blYUgg',
  },
  {
    name: 'Lotti Maudlen',
    email: 'lmaudlen5@cmu.edu',
    password: 'pA5C8TIu{=2?i',
  },
  {
    name: 'Berne Shillitto',
    email: 'bshillitto6@artisteer.com',
    password: 'tY1iT?5sn',
  },
  {
    name: 'Regine Godsafe',
    email: 'rgodsafe7@aboutads.info',
    password: 'rK9yPiT,IQ',
  },
  {
    name: 'Zorine Steart',
    email: 'zsteart8@rediff.com',
    password: "gF1x8r'oj",
  },
  {
    name: 'Inge De Andisie',
    email: 'ide9@blogs.com',
    password: 'vY0issdwiHIFC',
  },
];

const profiles = [
  {
    name: 'Alta renda',
  },
  {
    name: 'Baixa renda',
  },
];

const contacts = [
  {
    name: 'Ana Souza',
    cpf_cnpj: '12345678901',
    email: 'ana.souza@example.com',
    phone: '11987654321',
  },
  {
    name: 'Carlos Mendes',
    cpf_cnpj: '23456789012',
    email: 'carlos.mendes@example.com',
    phone: '21987654321',
  },
  {
    name: 'Beatriz Lima',
    cpf_cnpj: '34567890123',
    email: 'beatriz.lima@example.com',
    phone: '31987654321',
  },
  {
    name: 'Daniel Costa',
    cpf_cnpj: '45678901234',
    email: 'daniel.costa@example.com',
    phone: '41987654321',
  },
  {
    name: 'Fernanda Alves',
    cpf_cnpj: '56789012345',
    email: 'fernanda.alves@example.com',
    phone: '51987654321',
  },
  {
    name: 'Ricardo Oliveira',
    cpf_cnpj: '67890123456',
    email: 'ricardo.oliveira@example.com',
    phone: '61987654321',
  },
  {
    name: 'Juliana Martins',
    cpf_cnpj: '78901234567',
    email: 'juliana.martins@example.com',
    phone: '71987654321',
  },
  {
    name: 'Marcelo Silva',
    cpf_cnpj: '89012345678',
    email: 'marcelo.silva@example.com',
    phone: '81987654321',
  },
  {
    name: 'Patrícia Rocha',
    cpf_cnpj: '90123456789',
    email: 'patricia.rocha@example.com',
    phone: '92987654321',
  },
  {
    name: 'Rodrigo Fernandes',
    cpf_cnpj: '11223344556',
    email: 'rodrigo.fernandes@example.com',
    phone: '11976543210',
  },
  {
    name: 'Camila Ribeiro',
    cpf_cnpj: '22334455667',
    email: 'camila.ribeiro@example.com',
    phone: '21976543210',
  },
  {
    name: 'Thiago Nunes',
    cpf_cnpj: '33445566778',
    email: 'thiago.nunes@example.com',
    phone: '31976543210',
  },
  {
    name: 'Larissa Castro',
    cpf_cnpj: '44556677889',
    email: 'larissa.castro@example.com',
    phone: '41976543210',
  },
  {
    name: 'Gabriel Moraes',
    cpf_cnpj: '55667788990',
    email: 'gabriel.moraes@example.com',
    phone: '51976543210',
  },
  {
    name: 'Luciana Pereira',
    cpf_cnpj: '66778899001',
    email: 'luciana.pereira@example.com',
    phone: '61976543210',
  },
  {
    name: 'Felipe Teixeira',
    cpf_cnpj: '77889900112',
    email: 'felipe.teixeira@example.com',
    phone: '71976543210',
  },
  {
    name: 'Aline Monteiro',
    cpf_cnpj: '88990011223',
    email: 'aline.monteiro@example.com',
    phone: '81976543210',
  },
  {
    name: 'André Lima',
    cpf_cnpj: '99001122334',
    email: 'andre.lima@example.com',
    phone: '92976543210',
  },
  {
    name: 'Vanessa Torres',
    cpf_cnpj: '10111213141',
    email: 'vanessa.torres@example.com',
    phone: '11965432109',
  },
  {
    name: 'Leandro Almeida',
    cpf_cnpj: '21222324253',
    email: 'leandro.almeida@example.com',
    phone: '21965432109',
  },
  {
    name: 'Natália Farias',
    cpf_cnpj: '32333435364',
    email: 'natalia.farias@example.com',
    phone: '31965432109',
  },
  {
    name: 'Eduardo Cunha',
    cpf_cnpj: '43444546475',
    email: 'eduardo.cunha@example.com',
    phone: '41965432109',
  },
  {
    name: 'Bruna Cardoso',
    cpf_cnpj: '54555657586',
    email: 'bruna.cardoso@example.com',
    phone: '51965432109',
  },
  {
    name: 'Hugo Batista',
    cpf_cnpj: '65666768697',
    email: 'hugo.batista@example.com',
    phone: '61965432109',
  },
  {
    name: 'Tatiane Gomes',
    cpf_cnpj: '76777879708',
    email: 'tatiane.gomes@example.com',
    phone: '71965432109',
  },
  {
    name: 'Murilo Azevedo',
    cpf_cnpj: '87888980819',
    email: 'murilo.azevedo@example.com',
    phone: '81965432109',
  },
  {
    name: 'Paula Dias',
    cpf_cnpj: '98990090920',
    email: 'paula.dias@example.com',
    phone: '92965432109',
  },
  {
    name: 'João Henrique',
    cpf_cnpj: '11122233344',
    email: 'joao.henrique@example.com',
    phone: '11954321098',
  },
  {
    name: 'Sabrina Lopes',
    cpf_cnpj: '22233344455',
    email: 'sabrina.lopes@example.com',
    phone: '21954321098',
  },
  {
    name: 'Fábio Santana',
    cpf_cnpj: '33344455566',
    email: 'fabio.santana@example.com',
    phone: '31954321098',
  },
];

export { users, profiles, contacts };
