import zerorpc

from test_python import test_me

class PythonServer(object):
    def test(self, param):
        return test_me(param)

try:
    s = zerorpc.Server(PythonServer())
    s.bind('tcp://0.0.0.0:4242')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e