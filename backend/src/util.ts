import type {Request, Response} from 'express';

// TODO: This is kind of cringe.
export function respondWithError<Req extends Request, Res extends Response>(
    handler: (req: Req, res: Res) => Promise<void>,
): (req: Req, res: Res) => Promise<void> {
    return async (req, res) => {
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
