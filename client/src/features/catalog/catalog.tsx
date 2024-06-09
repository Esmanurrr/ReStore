import { useEffect } from 'react';
import ProductList from './ProductList';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchFilters, fetchProductsAsync, productSelectors } from './catalogSlice';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import ProductSearch from './ProductSearch';

const sortOptions = [
    {value: 'name', name: 'Alphabetical'},
    {value: 'priceDesc', name: 'Price - High to low'},
    {value: 'price', name: 'Price - Low to high'},
]

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if(!filtersLoaded) dispatch(fetchFilters());
    }, [dispatch, filtersLoaded])


    if (status.includes('pending')) return <LoadingComponent message='Loading products...' />

    return (
        <Grid container spacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch/>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <FormControl component='fieldset'>
                        <RadioGroup>
                            {sortOptions.map(({value, name}) => (
                                <FormControlLabel value={value} control={<Radio/>} label={name} key={value}/>

                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper sx={{p: 2, mb: 2}}>
                    <FormGroup>
                        {
                            brands.map(brand => (
                                <FormControlLabel control={<Checkbox/>} label={brand} key={brand} />
                            ))
                        }
                    </FormGroup>
                </Paper>
                <Paper sx={{p: 2, mb: 2}}>
                    <FormGroup>
                        {
                            types.map(type => (
                                <FormControlLabel control={<Checkbox/>} label={type} key={type} />
                            ))
                        }
                    </FormGroup>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={9}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>
                        Displaying 1-6 of 20 items
                    </Typography>
                    <Pagination color='secondary' size='large' count={18} page={2}/>
                </Box>
            </Grid>
        </Grid>
    )
}