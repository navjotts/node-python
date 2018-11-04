import zerorpc

class PythonServer(object):
    def test(self, param):
        return 'Hello World! - from python'

try:
    s = zerorpc.Server(PythonServer())
    s.bind('tcp://0.0.0.0:4242')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e