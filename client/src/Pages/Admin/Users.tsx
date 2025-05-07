import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm,  } from 'antd';
import {  toast } from 'react-toastify';
import axios from 'axios';


const UserTable: React.FC = () => {
    interface User {
        _id: string;
        name: string;
        email: string;
        role: string;
        // add more fields if needed
      }
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await axios.get('/api/user_management')
                setUsers(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(`Failed to load users: ${error.message}`);
                } else {
                    toast.error('Failed to load users due to unknown error');
                }
                
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            
            setUsers(users.filter(user => user._id !== id));
            toast.success('User deleted successfully');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Failed to delete user: ${error.message}`);
              } else {
                toast.error('Failed to delete user due to unknown error');
              }
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_:string ,record: User) => (
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="p-4">
            <Table
                dataSource={users}
                columns={columns}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
};

export default UserTable;