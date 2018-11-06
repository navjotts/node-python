import json
from pathlib import Path
from fastai import *
from fastai.vision import *
import zerorpc

path = Path()

def setup_model():
    classes = ['black', 'grizzly', 'teddys']
    data2 = ImageDataBunch.single_from_classes(path, classes, tfms=get_transforms(), size=224).normalize(imagenet_stats)
    learn = create_cnn(data2, models.resnet34)
    learn.load('stage-2')
    return learn

learn = setup_model()

class PythonServer(object):
    def test(self, param):
        return test_me(param)

    def predict_from_img(self, img_path):
        img = open_image(Path(img_path))
        pred_class,pred_idx,losses = learn.predict(img)
        print(pred_class, pred_idx, losses)
        json.dumps({ 'predict': losses })
        # return JSONResponse({
        #     "predictions": sorted(
        #         zip(cat_learner.data.classes, map(float, losses)),
        #         key=lambda p: p[1],
        #         reverse=True
        #     )
        # })

try:
    server = zerorpc.Server(PythonServer())
    server.bind('tcp://0.0.0.0:4242')
    server.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e
