from pathlib import Path
from fastai import *
from fastai.vision import *

# SETUP HERE
YOUR_CLASSES_HERE = ['black', 'grizzly', 'teddys'] # Your class labels
NAME_OF_PTH_FILE = 'stage-2' # Name of your exported `.pth` file

PATH_TO_MODELS_DIR = Path('.') # by default just use /models in root dir

class FastaiImageClassifier(object):
    def __init__(self):
        self.learner = self.setup_model(PATH_TO_MODELS_DIR, NAME_OF_PTH_FILE, YOUR_CLASSES_HERE, normalizer=imagenet_stats)

    def setup_model(self, path_to_pth_file, learner_name_to_load, classes, resnet_num=34, tfms=get_transforms(), normalizer=None, **kwargs):
        "Initialize our learner for inference"
        data = ImageDataBunch.single_from_classes(path_to_pth_file, classes, tfms=tfms, device=torch.device('cpu'), **kwargs)
        if (normalizer is not None): data.normalize(normalizer)
        resnet = self.get_resnet(resnet_num)
        learn = create_cnn(data, resnet, pretrained=False)
        learn.load(learner_name_to_load)
        return learn

    def get_resnet(self, resnet_num=34):
        "Specify resnet: 18, 34, 50, 101, 152"
        return getattr(models, f'resnet{resnet_num}')

    def predict(self, img_path):
        img = open_image(Path(img_path))
        pred_class, pred_idx, losses = self.learner.predict(img)
        print('Class pred:', pred_class)
        print('Pred-idx:', pred_idx)
        print('Losses:', losses)
        return { 'predict': pred_class }
