import { aop } from 'monking';

export default class test {
    constructor (logger, context) {
        this.context = context;
        this.logger = logger;
    }

    @aop('testAop')
    getName (name) {
        console.log(name);
    }
}
