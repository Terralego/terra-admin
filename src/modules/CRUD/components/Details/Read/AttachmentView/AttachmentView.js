import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import Loading from '../../../../../../components/Loading';
import { generateURI } from '../../../../config';
import './styles.scss';


const buildAttachmentList = (categories, attachment) => {
  if (!attachment || !categories) {
    return false;
  }
  const { results: attachmentList } = attachment;
  const { results: attachmentCategories } = categories;

  const categoryIDsToDisplay = attachmentList.reduce((IDs, { category }) => (
    IDs.includes(category) ? IDs : [...IDs, category]),
  []);

  return attachmentCategories
    .filter(({ id }) => categoryIDsToDisplay.includes(id))
    .map(category => ({
      ...category,
      attachments: attachmentList.filter(attach => attach.category === category.id),
    }));
};

const AttachmentView = ({
  attachmentCategories,
  getAttachmentCategories,
  attachmentCategoriesEndpoint,
  getAttachment,
  feature: {
    identifier: featureId,
    attachments: fileEndpoint,
    pictures: pictureEndpoint,
    attachmentFiles,
    attachmentImages,
  },
  match: { params: { layer, id, section, category } },
  t,
}) => {
  const attachmentEndpoint = section === 'attachmentFiles' ? fileEndpoint : pictureEndpoint;

  const [categories, setCategories] = useState(attachmentCategories);
  const [attachment, setAttachment] = useState({ attachmentFiles, attachmentImages });

  useEffect(() => {
    let didCancel = false;
    const getCategories = async () => {
      const result = await getAttachmentCategories(attachmentCategoriesEndpoint);
      if (!didCancel) {
        setCategories(result);
      }
    };
    if (!categories) {
      getCategories();
    }
    return () => {
      didCancel = true;
    };
  }, [attachmentCategoriesEndpoint, categories, getAttachmentCategories]);

  useEffect(() => {
    let didCancel = false;
    const getAttachments = async () => {
      const result = await getAttachment(attachmentEndpoint, featureId, section);
      setAttachment({
        ...attachment,
        [section]: result,
      });
      if (!didCancel) {
        setCategories(result);
      }
    };
    if (!attachment[section]) {
      getAttachments();
    }
    return () => {
      didCancel = true;
    };
  }, [attachment, attachmentEndpoint, featureId, getAttachment, section]);

  const list = buildAttachmentList(categories, attachment[section]);

  if (!list) {
    return <Loading spinner />;
  }

  if (!list.length) {
    return <span>{t('CRUD.details.attachment.noFiles')}</span>;
  }

  return (
    <Tabs
      selectedTabId={category || list[0].name}
      className="attachment"
    >
      {list.map(({ name, attachments, id: categoryId }) => (
        <Tab
          key={categoryId}
          id={name}
          title={<NavLink to={generateURI('layer', { layer, id, section, category: name })}>{name}</NavLink>}
          panel={(
            <ul className="attachment__list">
              {attachments.map(({
                id: attachmentID,
                legend,
                file,
                thumbnail,
                created_at: createAt,
              }) => {
                const CREATE_INFO = t('CRUD.details.attachment.createInfo', { date: createAt });
                return (
                  <li key={attachmentID} className="attachment__item">
                    {file
                      ? <span><a href={file} rel="download">{legend}</a> <small>{CREATE_INFO}</small></span>
                      : (
                        <figure className="attachment__figure">
                          <img src={thumbnail} alt="" />
                          <figcaption>{legend} <small>{CREATE_INFO}</small></figcaption>
                        </figure>
                      )}
                  </li>
                );
              })}
            </ul>
          )}
        />
      ))}
    </Tabs>
  );
};

AttachmentView.propTypes = {
  getAttachmentCategories: PropTypes.func,
  attachmentCategoriesEndpoint: PropTypes.string,
  attachmentCategories: PropTypes.shape({
    results: PropTypes.array,
  }),
  getAttachment: PropTypes.func,
  feature: PropTypes.shape({
    identifier: PropTypes.string,
    attachments: PropTypes.string,
    pictures: PropTypes.string,
    attachmentFiles: PropTypes.shape({
      results: PropTypes.array,
    }),
    attachmentImages: PropTypes.shape({
      results: PropTypes.array,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
      action: PropTypes.string,
      section: PropTypes.string,
      category: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
};

AttachmentView.defaultProps = {
  getAttachmentCategories () {},
  attachmentCategoriesEndpoint: undefined,
  attachmentCategories: undefined,
  getAttachment () {},
  feature: {
    identifier: undefined,
    attachments: undefined,
    pictures: undefined,
    attachmentFiles: undefined,
    attachmentImages: undefined,
  },
  match: {
    params: {
      layer: undefined,
      id: undefined,
      action: undefined,
      section: undefined,
      category: undefined,
    },
  },
  t: text => text,
};

export default AttachmentView;
