import {Logger} from "../../../api/dev/Logger";

describe('Logger', () => {

    it('> get a new logger should not throw', () => {
        Logger.getLogger('Test');
    });

    it('> log should not throw', () => {
        const logger = Logger.getLogger('Test');
        logger.info("test message");
        logger.warning("test message");
        logger.error("test message");
    });

});