import { Plugin } from '@uppy/core';
import { buildHeaders } from '@terralego/core/modules/Api';

class UppySetCategoryBeforeUpload extends Plugin {
  constructor (uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'SetCategoryBeforeUpload';
    this.opts = { ...opts };
    this.type = 'modifier';

    this.setCategoryBeforeUpload = this.setCategoryBeforeUpload.bind(this);
  }

  getCategory () {
    const { props: { category: selectedCategory, findOrCreateAttachmentCategory } } = this.opts;
    const { meta: { category = selectedCategory } } = this.uppy.getState();
    return findOrCreateAttachmentCategory(category);
  }

  setHeader () {
    const XHRUploadPlugin = this.uppy.plugins.uploader.find(({ id }) => id === 'XHRUpload');
    if (XHRUploadPlugin) {
      XHRUploadPlugin.opts.headers = buildHeaders();
    }
  }

  async setCategoryBeforeUpload (fileIDs) {
    const promises = fileIDs.map(fileID => {
      const file = this.uppy.getFile(fileID);
      this.uppy.emit('preprocess-progress', file, {
        mode: 'indeterminate',
      });
      return fileID;
    });

    const emitPreprocessCompleteForAll = async () => {
      const category = await this.getCategory();
      fileIDs.forEach(fileID => {
        const file = this.uppy.getFile(fileID);
        file.meta.category = category.id;
        this.uppy.emit('preprocess-complete', file);
      });
      this.setHeader();
    };

    // Why emit `preprocess-complete` for all files at once, instead of
    // above when each is processed?
    // Because it leads to StatusBar showing a weird “upload 6 files” button,
    // while waiting for all the files to complete pre-processing.
    return Promise.all(promises)
      .then(emitPreprocessCompleteForAll);
  }

  install () {
    this.uppy.addPreProcessor(this.setCategoryBeforeUpload);
  }

  uninstall () {
    this.uppy.removePreProcessor(this.setCategoryBeforeUpload);
  }
}

export default UppySetCategoryBeforeUpload;
