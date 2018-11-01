export default async (context, logger) => {
    return async (target) => {
        const result = await context.$injector.invoke(target);
        console.log(result);
    };
};
