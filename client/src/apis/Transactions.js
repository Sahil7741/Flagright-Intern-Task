const baseUrl = import.meta.env.VITE_API_URL;

export const listAllTransactions = async({ page = 1, limit = 25, sortBy = 'id', direction = 'asc', ip, deviceId, senderId, receiverId, minAmount, maxAmount } = {}) =>{
    const params = new URLSearchParams({ page, limit, sortBy, direction });
    if (ip) params.append('ip', ip);
    if (deviceId) params.append('deviceId', deviceId);
    if (senderId) params.append('senderId', senderId);
    if (receiverId) params.append('receiverId', receiverId);
    if (minAmount != null) params.append('minAmount', String(minAmount));
    if (maxAmount != null) params.append('maxAmount', String(maxAmount));
    const response = await fetch(`${baseUrl}/transactions?${params.toString()}`);
    if(!response.ok)
        throw new Error("Failed to fetch transactions");
    return response.json();
}

export const addTransactions = async({ senderId, receiverId, amount, ip, deviceId }) =>{

    const id = crypto.randomUUID();
    const response = await fetch(`${baseUrl}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            senderId,
            receiverId,
            ip,
            amount,
            deviceId
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add transaction');
    }

    return response.json();
}

export const updateTransaction = async({ id, senderId, receiverId, amount, ip, deviceId }) =>{
    const response = await fetch(`${baseUrl}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            senderId,
            receiverId,
            ip,
            amount,
            deviceId
        }),
    });

    if(!response.ok)
        throw new Error("Failed to update transaction");

    return response.json();
}

export const getTransactionRelationship = async({id}) =>{
    const response = await fetch(`${baseUrl}/relationships/transaction/${id}`);

    if(!response.ok)
        throw new Error('Failed to get Transaction Relationships');

    return response.json();
}