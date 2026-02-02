import classNames from 'classnames';
import { useField } from 'formik';
import { useEffect } from 'react';

const ImageUpload = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;

  useEffect(() => {
    if (!field.value) {
      const node = document.getElementById('imagePreview');
      if (node) node.src = '';
    }
  }, [field.value]);

  const onChange = (e) => {
    const file = e.target.files?.[0];
    const node = document.getElementById('imagePreview');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }

    helpers.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (node) node.src = reader.result;
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  return (
    <div className={uploadContainer}>
      <img
        id="imagePreview"
        className={classNames(imgStyle)}
        alt="preview"
        src={field.value ? undefined : ''}
      />

      <div className={inputContainer}>
        {!field.value && (
          <span>Support only images (*.png, *.gif, *.jpeg)</span>
        )}

        <input
          id="fileInput"
          type="file"
          accept=".jpg, .png, .jpeg"
          onChange={onChange}
          style={{ display: 'none' }}
        />

        <label htmlFor="fileInput">
          {field.value ? 'Change file' : 'Choose file'}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
