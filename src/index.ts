import { Bot } from './Client';
import { Colors as colors } from './Utils/Utils';

import packageJSON from '../package.json';

export const client = new Bot();
client.start().then(() => {
	client.logger.info('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');
	client.logger.info('');
	client.logger.info(`              • ${ client.user.username } ${ colors.FgMagenta + 'v' + packageJSON.version + colors.Reset } is now Online! •`);
	client.logger.info('');
	client.logger.info('          • Join our Discord Server for any Issues/Custom Bots •');
	client.logger.info(`                     ${ colors.FgGreen + colors.Underscore + 'https://ciderboi.xyz/discord' + colors.Reset }`);
	client.logger.info('');
	client.logger.info('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');
});
