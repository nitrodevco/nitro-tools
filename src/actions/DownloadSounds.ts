import { DownloadAndSaveUntil, NitroConfiguration } from '../utils';

export const DownloadSounds = async () =>
{
    await DownloadAndSaveUntil({
        url: `${NitroConfiguration.soundUrl}/sound_machine_sample_%i%.mp3`,
        destination: `./sounds/sound_machine_sample_%i%.mp3`
    });
}
