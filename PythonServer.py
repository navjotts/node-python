import zerorpc

from model_fastai import FastaiImageClassifier

PORT = 4242

class PythonServer(object):
    def listen(self):
        print(f'Python Server started listening on {PORT} ...')

    def predict_from_img(self, img_path):
        model = FastaiImageClassifier()
        return model.predict(img_path)

try:
    s = zerorpc.Server(PythonServer())
    s.bind(f'tcp://0.0.0.0:{PORT}')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e
