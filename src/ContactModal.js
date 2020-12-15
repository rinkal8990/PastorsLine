import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getContacts, clearContacts } from './redux/actions';

const ContactModal = (props) => {
    const [searchText, setSearchText] = useState('');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [contactDetails, setContactDetails] = useState(null);
    const [isEvenContacts, setIsEvenContacts] = useState(false);
    const dispatch = useDispatch();

    const data = useSelector(state => state);
    const filterSelector = createSelector(
        state => state.Contacts?.contacts_ids,
        items => items?.map((item) => {
            if (isEvenContacts) {
                if (item % 2 === 0) {
                    return item;
                }
                return null;
            } else {
                return item;
            }
        }).filter((val) => val !== null)
    );
    const filterIds = filterSelector(data);

    useEffect(() => {
        const getInitialData = () => {
            if (props.header === 'Modal A') {
                dispatch(getContacts({ page: 1, companyId: 171 }));
            } else {
                dispatch(getContacts({ page: 1, companyId: 171, countryId: 226 }));
            }
        }
        getInitialData();
    }, [dispatch, props.header]);

    const handleAboutToReachBottom = () => {
        if (data.Contacts && !data.APICallPagination && data.Contacts.total !== 0 && !(Math.ceil(data.Contacts.total / 20) === data.Contacts.page)) {
            let params = {
                page: data.Contacts.page + 1,
                companyId: 171,
                query: searchText
            }
            if (props.header === 'Modal B') {
                params.countryId = 226
            }
            dispatch(getContacts(params, true));
        }
    }

    const handleUpdate = (values) => {
        const { scrollTop, scrollHeight, clientHeight } = values;
        const pad = 1;
        const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
        if (t > 1) handleAboutToReachBottom();
    }

    const onSearchTextChange = (text) => {
        setSearchText(text);
        setTimeout(() => {
            if (!data.APICall) {
                dispatch(clearContacts());
                if (props.header === 'Modal A') {
                    dispatch(getContacts({ page: 1, companyId: 171, query: text }));
                } else {
                    dispatch(getContacts({ page: 1, companyId: 171, countryId: 226, query: text }));
                }
            }
        }, 500);
    }

    const onSearchClick = () => {
        if (!data.APICall) {
            dispatch(clearContacts());
            if (props.header === 'Modal A') {
                dispatch(getContacts({ page: 1, companyId: 171, query: searchText }));
            } else {
                dispatch(getContacts({ page: 1, companyId: 171, countryId: 226, query: searchText }));
            }
        }
    }

    return (
        <Modal isOpen size='xl'>
            <ModalHeader toggle={() => {
                dispatch(clearContacts());
                props.history.push('/');
            }}>
                {props.header}
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-a' onClick={() => {
                            if (props.header === 'Modal B') {
                                dispatch(clearContacts());
                                props.history.push('/modalA');
                            }
                        }}>All Contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-b' onClick={() => {
                            if (props.header === 'Modal A') {
                                dispatch(clearContacts());
                                props.history.push('/modalB')
                            }
                        }}>US Contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-c border-2' onClick={() => {
                            dispatch(clearContacts());
                            props.history.push('/');
                        }}>Close</Button>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col sm='12' md='11'>
                        <Input type='text' className='border-2 rounded' placeholder='Search Contacts...'
                            onChange={(event) => {
                                onSearchTextChange(event.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    onSearchClick();
                                }
                            }} />
                    </Col>
                    <Col sm='12' md='1'>
                        <Button onClick={onSearchClick}>Search</Button>
                    </Col>
                </Row>
                <Scrollbars className='mt-3' autoHeight autoHeightMin={400} onUpdate={handleUpdate}>
                    {
                        data.APICall ?
                            <div className='w-100 d-flex align-items-center justify-content-center'>
                                <Spinner />
                            </div>
                            :
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Country</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filterIds?.map((item, index) => {
                                            return (
                                                <tr key={item} onClick={() => {
                                                    setContactDetails(data.Contacts.contacts[item]);
                                                    setIsDetailModalVisible(!isDetailModalVisible);
                                                }}>
                                                    <td>{item}</td>
                                                    <td>{data.Contacts.contacts[item].first_name}</td>
                                                    <td>{data.Contacts.contacts[item].last_name}</td>
                                                    <td>{data.Contacts.contacts[item].country.iso}</td>
                                                    <td>{data.Contacts.contacts[item].phone_number}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        data.APICallPagination &&
                                        <tr>
                                            <td colSpan={5} className='text-center'>
                                                <Spinner />
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                    }
                </Scrollbars>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-start ml-5'>
                <Label check>
                    <Input type="checkbox" value={isEvenContacts} onChange={() => setIsEvenContacts(!isEvenContacts)} />{' '}
                         Only even
                </Label>
            </ModalFooter>
            {/* Detail modal */}
            <Modal isOpen={isDetailModalVisible}>
                <ModalHeader toggle={() => {
                    setContactDetails(null);
                    setIsDetailModalVisible(!isDetailModalVisible);
                }}>
                    Modal C
                </ModalHeader>
                <ModalBody>
                    {
                        contactDetails &&
                        <ul>
                            <li>{contactDetails.first_name}</li>
                            <li>{contactDetails.last_name}</li>
                            <li>{contactDetails.country.iso}</li>
                            <li>{contactDetails.phone_number}</li>
                        </ul>
                    }
                </ModalBody>
            </Modal>
        </Modal >
    )
}

export default ContactModal;