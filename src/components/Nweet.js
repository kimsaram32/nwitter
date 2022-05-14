import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isCreator }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure to delete this nweet?');
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      window.alert('Deleted nweet');
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async event => {
    event.preventDefault();

    window.alert('Updating...');

    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });

    setEditing(false);
  };
  const onChange = event => {
    setNewNweet(event.target.value);
  };

  return (
    <div key={nweetObj.id} className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input 
              value={newNweet} 
              placeholder="Edit your nweet" 
              onChange={onChange} 
              required
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
       ) : (
         <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="Attachment" />}
          {isCreator && (
            <div class="nweet__actions">
            <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;