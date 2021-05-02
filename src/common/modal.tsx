import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { Context as MainContext } from '../context/mainContext'
interface ModalProps {
  visible: boolean,
  toggleModal?: () => void,
  children: any,
  title?: string,
  refundItem: () => void
}

const CustomModal = ({ visible, toggleModal, children, title, refundItem }: ModalProps) => {
  const { state: { loading } } = useContext<any>(MainContext);
  return (
    <div>
      <Modal isOpen={visible} backdrop={true} >
        <ModalHeader >{title}</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={refundItem}>
            Refund {loading && <Spinner color="light" />}
          </Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}

export { CustomModal };