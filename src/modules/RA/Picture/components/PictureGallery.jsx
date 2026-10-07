import React  from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  gallery: {
    height: '100%',
    width: '100%',
    top: '10px',
    overflow: 'auto',
  },
  galleryItem: {
    border: 0,
    padding: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    width: '130px',
    margin: '10px auto',
    '&.image-selected': {
      borderTop: '4px solid #3f51b5',
    },
  },

});


const PictureGallery = ({ pictures, selected, setSelected, toLocaleDateString }) => {
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <div className={classes.gallery}>
      {pictures.map((picture, index) => (
        <div
          role="button"
          tabIndex="0"
          className={
        (index === selected)
          ? `${classes.galleryItem} image-selected`
          : classes.galleryItem
      }
          onClick={() => setSelected(index)}
          onKeyPress={() => setSelected(index)}
        >
          <img
            src={picture.file.thumbnail}
            alt={translate('resources.picture.input.gallery-image', { index })}
            style={{
              width: '130px',
              maxWidth: '130px',
              border: 'none',
            }}
          />
          <span className="date-time">
            {picture.date && toLocaleDateString(picture.date)}
          </span>
        </div>
      ))}
    </div>
  );
};
export default PictureGallery;
