import { Body, Button, Container, Head, Html, Link, Preview, Text } from '@react-email/components';

interface TemplateProps {
    name: string;
    href?: string;
}

const RecoveryPassTemplate = ({ name, href }: TemplateProps) => {
    return (
        <Html>
            <Head />
            <Preview>Redefinição de senha Jira</Preview>
            <Body style={{ backgroundColor: '#fff', fontFamily: 'sans-serif', margin: 'auto', textAlign: 'center' }} >
                <Container style={{ border: '1px solid #eaeaea', borderRadius: '40px', margin: '40px auto', padding: '20px', width: '465px' }} >
                    {/* <Section style={{ marginTop: '32px' }}>
                        <Img src={Logo.src} width={40} height={37} style={{ margin: '0 auto' }} />
                    </Section> */}

                    {/* <Hr /> */}

                    <Text>
                        {`Olá, ${name}`}
                    </Text>

                    <Text>
                        Recebemos uma solicitação para redefinir a senha associada à sua conta.
                        Para prosseguir com a recuperação de senha, por favor, clique no botão abaixo para que possa ser redirecionado à página de redefinição:
                    </Text>

                    <Button href={href} style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#020617', color: '#fff', cursor: 'pointer', textDecoration: 'none', borderRadius: '5px', marginTop: '10px' }} >Redefinir senha</Button>

                    <Text>
                        Caso o botão acima venha a não funcionar, clique no link abaixo para que possa ser redirecionado para a página:
                    </Text>

                    <Link href={href} style={{ textDecoration: 'none', color: '#0d6efd', marginTop: '10px' }}>{href}</Link>

                    {/* <Hr /> */}

                    {/* <Section style={{ marginTop: '32px' }}>
                        <Img src={Logo.src} width={40} height={37} style={{ margin: '0 auto' }} />
                        <Text>Sangati Berga S.A</Text>
                    </Section> */}

                </Container>
            </Body>
        </Html>
    )
}

export default RecoveryPassTemplate

