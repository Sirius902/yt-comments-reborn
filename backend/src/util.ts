import type {Request, Response} from 'express';

/**
 * Wraps a route handler to return an internal server error when an error is
 * thrown. Uses the error's message as the body of the response.
 */
export function respondWithError<Req extends Request, Res extends Response>(
    handler: (req: Req, res: Res) => Promise<void>
) {
    return async (req: Req, res: Res) => {
        try {
            await handler(req, res);
        } catch (e) {
            if (e instanceof Error) {
                res.status(500).json(e.message);
            } else {
                res.status(500).json('Unknown error type');
            }
        }
    };
}
