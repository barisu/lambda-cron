export const handler = (event: any, context: any, callback: any) => {
    console.log('Hello, World!');
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello, World!' }),
    };
    callback(undefined, response);
};
