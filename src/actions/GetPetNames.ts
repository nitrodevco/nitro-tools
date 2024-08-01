import { GetExternalVariables } from './GetExternalVariables';

let petNames: string[] = null;

export const GetPetNames = async () =>
{
    try
    {
        if (!petNames)
        {
            const externalVariables = await GetExternalVariables();

            petNames = [];

            externalVariables['pet.configuration']?.split(',')?.forEach(petName =>
            {
                petName = petName.trim();

                if (petNames.indexOf(petName) >= 0) return;

                petNames.push(petName);
            });
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return petNames;
}
