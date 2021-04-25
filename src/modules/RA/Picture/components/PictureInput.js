import React, { useEffect, useState } from 'react';
import SideBySideImages from '@terralego/core/modules/Picture/compare/SideBySideImages';

import {
  useDataProvider,
  useInput,
  useTranslate,
  ImageInput,
  ImageField,

} from 'react-admin';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {  makeStyles } from '@material-ui/core/styles';

import { RES_VIEWPOINT } from '../../ra-modules';
import { toLocaleDateString } from '../../../../utils/date';
import PictureGallery from './PictureGallery';

const useStyles = makeStyles({
  picture: {
    position: 'relative',
    float: 'right',
    width: '50%',
    '& .previews div': {
      width: '100%',
      height: 'auto',
    },
    '& .previews img': {
      width: '100%',
      height: 'auto',
      maxHeight: 'inherit',
    },
    '& .refusal': {
      position: 'absolute',
      bottom: '1em',
      left: 0,
      right: 0,
      padding: '2em',
      fontSize: '1.5em',
      margin: '0 -8px 0 8px',
      color: 'orange',
      backgroundColor: 'rgba(23, 23, 23, 0.43)',
    },
  },
  modal: {
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    height: '70%',
    width: '80%',
    backgroundColor: 'white',
    padding: '2em',
    '& .actions': {
      paddingBottom: '2em',
      display: 'flex',
      justifyContent: 'space-between',
    },
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  compareContainer: {
    height: '70%',
    width: '80%',
    position: 'absolute',
    left: '110px',
    top: '10px',
  },
  galleryContainer: {
    height: '100%',
    width: '130px',
  },
  compareTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picturesDates: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const PictureInput = props => {
  const {
    record: {
      viewpoint,
      id,
      state,
      properties: { refusal_message: refusalMessage } = {},
    } = {},
  } = props;

  const { input: { value: pic } } = useInput(props);
  const [showModal, setShowModal] = useState(false);
  const [picturesList, setPicturesList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const classes = useStyles();
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const { data: { pictures } } = await dataProvider.getOne(RES_VIEWPOINT, { id: viewpoint });
      if (!isMounted) {
        return;
      }
      const filteredPictures = pictures.filter(({ id: picId }) => picId !== id);
      setPicturesList(filteredPictures);
      setSelectedIndex(0);
    };

    loadData();

    return () => { isMounted = false; };
  }, [dataProvider, id, viewpoint]);

  return (
    <div className={classes.picture}>
      <Modal open={showModal}>
        <div className={classes.modal}>
          <div className={classes.galleryContainer}>
            <PictureGallery
              pictures={picturesList}
              toLocaleDateString={toLocaleDateString}
              selected={selectedIndex}
              setSelected={setSelectedIndex}
            />
          </div>

          <div className={classes.compareContainer}>
            <Typography component="h4" className={classes.compareTitle}>
              {translate('resources.picture.input.compare-title')}
            </Typography>
            {(selectedIndex === null) && <SideBySideImages pictures={[pic]} />}
            {(selectedIndex !== null) && (
              <>
                <div className={classes.picturesDates}>
                  <Typography component="h5">
                    {translate('resources.picture.input.compare-target')}
                    {' - '}
                    {toLocaleDateString(pic.date)}
                  </Typography>
                  <Typography component="h5">
                    {translate('resources.picture.input.compare-selected')}
                    {' - '}
                    {toLocaleDateString(picturesList[selectedIndex]?.date)}
                  </Typography>
                </div>
                <SideBySideImages pictures={[pic, picturesList[selectedIndex]]} />
              </>
            )}
            <Button
              variant="outlined"
              type="button"
              onClick={() => setShowModal(false)}
              style={{ marginTop: '10px' }}
            >
              {translate('common.close')}
            </Button>
          </div>
        </div>
      </Modal>
      <ImageInput source="file" accept="image/*" {...props}>
        <ImageField source="full" />
      </ImageInput>
      {
        refusalMessage && state === 'refused' &&
        (<p className="refusal">{`${translate('resources.picture.states.refused')} - ${refusalMessage}`}</p>)
      }
      {pic.file && (
        <Button variant="outlined" type="button" onClick={() => setShowModal(true)}>
          {translate('resources.picture.input.compare')}
        </Button>
      )}
    </div>
  );
};


export default PictureInput;
