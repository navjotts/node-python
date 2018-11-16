import zerorpc

from test_python import test_me

PORT = 4242

class PythonServer(object):
    def listen(self):
        print(f'Python Server started listening on {PORT} ...')

    def test(self, param):
        return test_me(param)

try:
    s = zerorpc.Server(PythonServer())
    s.bind(f'tcp://0.0.0.0:{PORT}')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e