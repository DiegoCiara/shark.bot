import User from '@entities/User';
import bcrypt from 'bcryptjs';
import { users, profiles, contacts } from './dataMock';
import Workspace from '@entities/Workspace';
import Profile from '@entities/Profile';
import Contact from '@entities/Contact';

const mocks = async (): Promise<void> => {
  try {
    const [hasWorkspaces] = await Promise.all([Workspace.count()]);
    const [hasUsers] = await Promise.all([User.count()]);
    const [hasProfiles] = await Promise.all([Profile.count()]);
    const [hascontacts] = await Promise.all([Contact.count()]);

    if (
      hasWorkspaces > 0 &&
      hasUsers > 0 &&
      hasProfiles > 0 &&
      hascontacts > 0
    ) {
      console.log('Mocks ok');
      return;
    }

    const workspace = await Workspace.create({
      name: 'Endurance Tecnologia',
    }).save();

    console.log(`🏛️ Workspace "${workspace.name}" criado com sucesso`);

    for (const user of users) {
      const password_hash = await bcrypt.hash(user.password, 10);
      const element = await User.create({
        ...user,
        password_hash,
        workspace,
      }).save();
      console.log(`👤 Usuário "${element.name}" criado com sucesso`);
    }
    for (const profile of profiles) {
      const element = await Profile.create({ ...profile, workspace }).save();
      console.log(`⚙️ Perfil "${element.name}" criado com sucesso`);
    }
    for (const contact of contacts) {
      const profile = await Profile.findOne();
      const element = await Contact.create({
        ...contact,
        workspace,
        profile,
      }).save();
      console.log(`🍎 Cliente "${element.name}" criado com sucesso`);
    }
  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;
