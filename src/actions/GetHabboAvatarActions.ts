import { IHabboAvatarActions } from '../core';
import { HabboAvatarActionsMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML, SaveJson } from '../utils';

let habboAvatarActions: IHabboAvatarActions = null;

export const GetHabboAvatarActions = async () =>
{
    try
    {
        if (!habboAvatarActions)
        {
            const xml = await ParseXML(await FetchText({ url: NitroConfiguration.habboAvatarActionsUrl }));

            habboAvatarActions = {};

            HabboAvatarActionsMapper.mapXML(xml, habboAvatarActions);

            await SaveJson(habboAvatarActions, `./gamedata/HabboAvatarActions.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return habboAvatarActions;
}
