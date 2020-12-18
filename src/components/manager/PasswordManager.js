import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PasswordManager = () => {
  const LOCAL_STORAGE = () =>
    JSON.parse(localStorage.getItem('Passwords')) || [];
  const [passwordItems, setPasswordItems] = useState(LOCAL_STORAGE);
  const [passwordLength, setPasswordLength] = useState('');
  const [passwordTitle, setPasswordTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [editingPassword, setEditingPassword] = useState('');
  const inputPasswordRef = useRef(null);
  const inputTitleRef = useRef(null);

  const handlePasswordLengthChange = e => setPasswordLength(e.target.value);

  const handlePasswordTitleChange = e => setPasswordTitle(e.target.value);

  const generatePassword = () => {
    const length = passwordLength;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; i++) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (passwordLength === '') return;
    if (isEditing) {
      setPasswordItems(prevState => {
        const newItems = [...prevState];
        const index = newItems.findIndex(item => item.id === editId);
        newItems.splice(index, 1, {
          id: editId,
          title: passwordTitle,
          password: editingPassword,
          isVisible: false,
        });
        return newItems;
      });
      setIsEditing(false);
      setPasswordTitle('');
      setEditId('');
      setEditingPassword('');
      return;
    }
    setPasswordItems(prevState => [
      ...prevState,
      {
        id: uuidv4(),
        title: passwordTitle,
        password: generatePassword(),
        isVisible: false,
      },
    ]);
    setPasswordTitle('');
  };

  const handleVisible = (id, title, password, isVisible) => {
    if (isVisible) {
      setPasswordItems(prevState => {
        const newItems = [...prevState];
        const index = newItems.findIndex(item => item.id === id);
        newItems.splice(index, 1, {
          id,
          title,
          password,
          isVisible: false,
        });
        return newItems;
      });
    } else {
      setPasswordItems(prevState => {
        const newItems = [...prevState];
        const index = newItems.findIndex(item => item.id === id);
        newItems.splice(index, 1, {
          id,
          title,
          password,
          isVisible: true,
        });
        return newItems;
      });
    }
  };

  const handleDelete = id =>
    setPasswordItems(prevState => prevState.filter(item => item.id !== id));

  const handleEdit = (id, title, password) => {
    inputTitleRef.current.focus();
    setIsEditing(prevState => !prevState);
    setPasswordTitle(title);
    setEditId(id);
    setEditingPassword(password);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordTitle('');
    setEditId('');
    setEditingPassword('');
  };

  useEffect(() => inputPasswordRef.current.focus(), []);

  useEffect(
    () => localStorage.setItem('Passwords', JSON.stringify(passwordItems)),
    [passwordItems]
  );

  return (
    <div className="manager">
      <div className="lg-container">
        <div className="manager-parent">
          <i className="key fas fa-key"></i>
          <h1 className="manager-title">
            {isEditing ? 'Edit mode' : 'Password Manager'}
          </h1>
          <form className="manager-form" onSubmit={handleSubmit}>
            {isEditing && (
              <label className="manager-form-label" htmlFor="password-title">
                On edit mode, <br /> you may only change the title.
              </label>
            )}
            <div className="manager-form-input-container">
              {!isEditing && (
                <input
                  type="number"
                  className="manager-input"
                  onChange={handlePasswordLengthChange}
                  ref={inputPasswordRef}
                  value={passwordLength}
                  name="password-length"
                  id="password-input"
                  placeholder="Password length..."
                  autoComplete="off"
                  max="30"
                  min="5"
                  required={isEditing ? false : true}
                  disabled={isEditing ? true : false}
                />
              )}
              <input
                type="text"
                className="manager-input"
                onChange={handlePasswordTitleChange}
                ref={inputTitleRef}
                value={passwordTitle}
                name="password-title"
                id="password-title"
                placeholder="Enter title..."
                autoComplete="off"
                maxLength="20"
                required={true}
              />
            </div>
            <div className="manager-form-btn-container">
              <button type="submit" className="btn-border">
                {isEditing ? 'update' : 'generate'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-border"
                >
                  cancel
                </button>
              )}
            </div>
          </form>
          <ul className="manager-ul">
            {passwordItems.length === 0 ? (
              <div className="lock-container">
                <i className="lock fas fa-lock"></i>
              </div>
            ) : (
              passwordItems.map(item => (
                <li className="manager-ul-li" key={item.id}>
                  <h5 className="manager-ul-li-title">{item.title}</h5>
                  <div className="manager-ul-li-container">
                    <input
                      className="hidden-password"
                      contentEditable="false"
                      type={!item.isVisible ? 'password' : 'text'}
                      value={item.password}
                      readOnly
                    />
                    <div>
                      <button
                        onClick={() =>
                          handleVisible(
                            item.id,
                            item.title,
                            item.password,
                            item.isVisible
                          )
                        }
                        title="Reveal"
                        className="manager-li-icons"
                        disabled={isEditing ? true : false}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="manager-li-icons"
                        disabled={isEditing ? true : false}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(item.id, item.title, item.password)
                        }
                        title="Edit"
                        className="manager-li-icons"
                        disabled={isEditing ? true : false}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordManager;
