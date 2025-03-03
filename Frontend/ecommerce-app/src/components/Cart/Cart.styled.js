import styled from 'styled-components';

export const CartWrapper = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
`;

export const Title = styled.h2`
  text-align: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

export const Button = styled.button`
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const Input = styled.input`
  padding: 8px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
