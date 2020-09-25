import React, { useState } from 'react'
import PropTypes, { ReactElementLike } from 'prop-types'
import styles from '@/styles/modal.module.scss'

const ModalBody: React.FunctionComponent<{
    children: ReactElementLike,
    onClose: () => void
}> = ({ children, onClose }) => {
    return (
        <div>
            {children}
            <button onClick={onClose}>
                Close
            </button>
        </div>
    )
}

export function Modal(props: {
    modalButtonText: string,
    modalTitle: string,
    closeAction: (cb: () => void) => void,
    children: PropTypes.ReactElementLike
}) {
    const [show, setShow] = useState(false)

    const close = () => {
        setShow(false)
    }

    const className = `${styles.modal} ${show ? styles.on : styles.off}`
    return (
        <div>
            <button onClick={() => setShow(true)}>{props.modalButtonText}</button>
            <div className={className}>
                <h2>{props.modalTitle}</h2>
                <ModalBody children={props.children} onClose={() => props.closeAction(close)} />
            </div >
        </div>
    )
}

ModalBody.propTypes = {
    children: PropTypes.element.isRequired,
    onClose: PropTypes.func.isRequired,
}