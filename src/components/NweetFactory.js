import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { storageService, dbService } from 'fbase';
import { useUserObj } from 'userObjContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = () => {
  const [nweet, setNweet] = useState('');
  const [attachment, setAttachment] = useState('');
  const userObj = useUserObj();

  const onSubmit = async event => {
    if (nweet === "") {
      return;
    }

    event.preventDefault();
    let attachmentUrl = '';

    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuid()}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }
    
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    };
    await dbService.collection('nweets').add(nweetObj);
    setNweet('');
    setAttachment('');
  };
  const onTextChange = event => {
    const { value } = event.target;
    setNweet(value);
  };
  const onFileChange = event => {
    const {
      target: { files }
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(file);
  };
  const onClearAttachmentClick = () => setAttachment('');

  return (
    <form onSubmit={onSubmit} className="factoryForm">
    <div className="factoryInput__container">
      <input
        className="factoryInput__input"
        value={nweet}
        onChange={onTextChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type="submit" value="&rarr;" className="factoryInput__arrow" />
    </div>
    <label for="attach-file" className="factoryInput__label">
      <span>Add photos</span>
      <FontAwesomeIcon icon={faPlus} />
    </label>
    <input
      id="attach-file"
      type="file"
      accept="image/*"
      onChange={onFileChange}
      style={{
        opacity: 0,
      }}
    />
    {attachment && (
      <div className="factoryForm__attachment">
        <img
          src={attachment}
          alt="Attachment"
          style={{
            backgroundImage: attachment,
          }}
        />
        <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
          <span>Remove</span>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    )}
    </form>
  );
};

export default NweetFactory;