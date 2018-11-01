import { Get, aopInject } from 'monking';
import { view } from '../../../src';

export default class Home {
    @Get('/home')
    @view('/home')
    async home (render) {
        render({
            title: 'hom'
        });
    }

    @Get('/test')
    @aopInject('whiteList')
    async test (context, test) {
        test.getName('test');
        context.body = 1234;
        return 'testaop';
    }
}
