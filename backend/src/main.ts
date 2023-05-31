import 'dotenv/config';
import app from './app';
import {DummyAuthProvider, setProvider} from './authProvider';

setProvider(new DummyAuthProvider());

const port = 3010;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API Testing UI: http://localhost:${port}/v0/api-docs/`);
});
