import { Loading, Modal } from "carbon-components-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../lib/api";

export interface DeleteClassModalProps {
    className: string;
    subject: string;
    id: string;
    open: boolean;
    handleRequestClose: () => void;
}

const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
    className,
    id,
    subject,
    open,
    handleRequestClose,
}) => {
    const [submitting, setSubmit] = React.useState(false);
    const history = useHistory();

    return (
        <Modal
            modalHeading={`Delete ${className}?`}
            modalLabel="Classes"
            danger
            primaryButtonText="Delete Class"
            primaryButtonDisabled={submitting}
            preventCloseOnClickOutside={submitting}
            open={open}
            onRequestClose={handleRequestClose}
            size="xs"
            onRequestSubmit={async () => {
                setSubmit(true);

                try {
                    const res = await makeAuthenticatedRequest("DELETE", `/classes/${id}`);

                    if (res.status !== 204) return setSubmit(false);

                    history.replace("/dashboard");
                } catch (error) {}
            }}
        >
            {submitting && <Loading description="One moment" withOverlay={true} small />}
            <p>
                Are you sure you want to delete {subject} - {className}?
            </p>
        </Modal>
    );
};

export default DeleteClassModal;
