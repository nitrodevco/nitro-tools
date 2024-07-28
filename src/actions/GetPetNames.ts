import { GetExternalVariables } from './GetExternalVariables';

export const GetPetNames = async () =>
{
    const externalVariables = await GetExternalVariables();

    let petNames: string[] = [];

    externalVariables['pet.configuration']?.split(',')?.forEach(petName => petNames.push(petName.trim()));

    return petNames;
}
