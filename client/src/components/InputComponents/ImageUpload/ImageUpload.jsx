import classNames from 'classnames';
import { useField } from 'formik';

const ImageUpload = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;

  const onChange = (e) => {
    const file = e.target.files?.[0];
    const node = document.getElementById('imagePreview');

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }

    helpers.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      node.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>

        <input
          id="fileInput"
          type="file"
          accept=".jpg, .png, .jpeg"
          onChange={onChange}
          value={undefined}
        />

        <label htmlFor="fileInput">Choose file</label>
      </div>

      <img
        id="imagePreview"
        className={classNames({ [imgStyle]: !!field.value })}
        alt="user"
      />
    </div>
  );
};

export default ImageUpload;
