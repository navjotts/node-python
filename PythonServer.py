import zerorpc
from model_fastai import FastaiImageClassifier

class PythonServer(object):
    def predict_from_img(self, img_path):
        model = FastaiImageClassifier()
        return model.predict(img_path)

try:
    server = zerorpc.Server(PythonServer())
    server.bind('tcp://0.0.0.0:4242')
    server.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e