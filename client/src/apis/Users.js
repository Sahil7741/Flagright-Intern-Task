const baseUrl = import.meta.env.VITE_API_URL;

export const addUser = async ({firstName, lastName, email, phone, address, payment_methods}) =>{
    const id = crypto.randomUUID();
    const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            name: firstName + " " + lastName,
            email,
            phone,
            address,
            payment_methods
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add user');
    }

    return response.json();
}

export const listAllUsers = async ({ page = 1, limit = 25, sortBy = 'id', direction = 'asc', q = '' } = {}) =>{
    const params = new URLSearchParams({ page, limit, sortBy, direction });
    if(q) params.append('q', q);
    const response = await fetch(`${baseUrl}/users?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export const updateUser = async ({id, firstName, lastName, email, phone, address, payment_methods}) => {
    console.log({id, firstName, lastName, address, phone, payment_methods, email});
    const response = await fetch(`${baseUrl}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            name: firstName + " " + lastName,
            email,
            phone,
            address,
            payment_methods
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
}

export const getUserRelations = async ({id}) => {
    const response = await fetch(`${baseUrl}/relationships/user/${id}`);

    if(!response.ok)
        throw new Error('Failed to get User Relationships');

    return response.json();
}