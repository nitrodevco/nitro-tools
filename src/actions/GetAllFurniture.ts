import { IFurnitureAlias, IFurnitureType } from '../core';
import { GetFurnitureData } from './GetFurnitureData';
import { GetPosterIds } from './GetPosterIds';

let allFurniture: IFurnitureType[] = null;

export const GetAllFurniture = async () =>
{
    try
    {
        if (!allFurniture)
        {
            const furnitureData = await GetFurnitureData();
            const posterIds = await GetPosterIds();

            const aliases: IFurnitureAlias[] = [
                ...posterIds.map(posterId =>
                {
                    return { name: 'poster', alias: `poster_${posterId}` };
                }),
                { name: 'footylamp', alias: 'footylamp_campaign_ing' },
                { name: 'easy_bowl2', alias: 'easy_bowl' },
                { name: 'ads_cllava2', alias: 'ads_cllava' },
                { name: 'rare_icecream_campaign', alias: 'rare_icecream_campaign2' },
                { name: 'calippo', alias: 'calippo_cmp' },
                { name: 'igor_seat', alias: 'igor_seatcmp' },
                { name: 'ads_711', alias: 'ads_711c' },
                { name: 'ads_cltele', alias: 'ads_cltele_cmp' },
                { name: 'ads_ob_pillow', alias: 'ads_ob_pillowcmp' },
                { name: 'ads_711shelf', alias: 'ads_711shelfcmp' },
                { name: 'ads_frankb', alias: 'ads_frankbcmp' },
                { name: 'ads_grefusa_cactus', alias: 'ads_grefusa_cactus_camp' },
                { name: 'ads_cl_jukeb', alias: 'ads_cl_jukeb_camp' },
                { name: 'ads_reebok_block2', alias: 'ads_reebok_block2cmp' },
                { name: 'ads_cl_sofa', alias: 'ads_cl_sofa_cmp' },
                { name: 'ads_calip_cola', alias: 'ads_calip_colac' },
                { name: 'ads_calip_chair', alias: 'ads_calip_chaircmp' },
                { name: 'ads_calip_pool', alias: 'ads_calip_pool_cmp' },
                { name: 'ads_calip_tele', alias: 'ads_calip_telecmp' },
                { name: 'ads_calip_parasol', alias: 'ads_calip_parasol_cmp' },
                { name: 'ads_calip_lava', alias: 'ads_calip_lava2' },
                { name: 'ads_calip_fan', alias: 'ads_calip_fan_cmp' },
                { name: 'ads_oc_soda', alias: 'ads_oc_soda_cmp' },
                { name: 'ads_1800tele', alias: 'ads_1800tele_cmp' },
                { name: 'ads_spang_sleep', alias: 'ads_spang_sleep_cmp' },
                { name: 'ads_cl_moodi', alias: 'ads_cl_moodi_camp' },
                { name: 'ads_droetker_paula', alias: 'ads_droetker_paula_cmp' },
                { name: 'ads_chups', alias: 'ads_chups_camp' },
                { name: 'garden_seed', alias: 'garden_seed_cmp' },
                { name: 'ads_grefusa_yum', alias: 'ads_grefusa_yum_camp' },
                { name: 'ads_cheetos', alias: 'ads_cheetos_camp' },
                { name: 'ads_chocapic', alias: 'ads_chocapic_camp' },
                { name: 'ads_capri_chair', alias: 'ads_capri_chair_camp' },
                { name: 'ads_capri_lava', alias: 'ads_capri_lava_camp' },
                { name: 'ads_capri_arcade', alias: 'ads_capri_arcade_camp' },
                { name: 'ads_pepsi0', alias: 'ads_pepsi0_camp' },
                { name: 'ads_cheetos_hotdog', alias: 'ads_cheetos_hotdog_camp' },
                { name: 'ads_cheetos_bath', alias: 'ads_cheetos_bath_camp' },
                { name: 'ads_oc_soda_cherry', alias: 'ads_oc_soda_cherry_cmp' },
                { name: 'ads_disney_tv', alias: 'ads_disney_tvcmp' },
                { name: 'ads_hh_safe', alias: 'ads_hh_safecmp' },
                { name: 'ads_sunnyvend', alias: 'ads_sunnyvend_camp' },
                { name: 'ads_rangocactus', alias: 'ads_rangocactus_camp' },
                { name: 'ads_wowpball', alias: 'ads_wowpball_camp' },
                { name: 'ads_suun', alias: 'ads_suun_camp' },
                { name: 'ads_liisu', alias: 'ads_liisu_camp' },
                { name: 'ads_honeymonster', alias: 'ads_honeymonster_cmp' },
                { name: 'ads_ag_crate', alias: 'ads_ag_crate_camp' },
                { name: 'ads_dfrisss', alias: 'ads_dfrisss_camp' },
            ];

            allFurniture = [
                ...furnitureData.roomitemtypes.furnitype,
                ...furnitureData.wallitemtypes.furnitype,
            ];

            for (const item of aliases)
            {
                const furniture = allFurniture.find(furniture => item.name === furniture.classname);

                if (furniture) allFurniture.push({ classname: item.alias, revision: furniture.revision });
            }
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return allFurniture;
}
